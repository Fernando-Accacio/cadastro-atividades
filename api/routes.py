from flask import request, jsonify, current_app, g
from sqlalchemy.orm import Session
from collections import defaultdict
# Importa o novo modelo 'Hobby'
from .models import get_db_session, Project, Contact, User, Hobby
from sqlalchemy.exc import IntegrityError
import jwt
from datetime import datetime, timedelta
from functools import wraps

import cloudinary.uploader
import cloudinary

# Decorador token_required (sem mudanças)
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token_str = request.headers['Authorization']
            if token_str.startswith('Bearer '):
                token = token_str.split(' ')[1]
        if not token:
            return jsonify({'error': 'Token de autenticação está faltando!'}), 401
        try:
            secret_key = current_app.config['JWT_SECRET_KEY']
            data = jwt.decode(token, secret_key, algorithms=["HS256"])
            g.current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirou!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token é inválido!'}), 401
        return f(*args, **kwargs)
    return decorated


def init_routes(app):

    def get_db():
        db_session_generator = get_db_session()
        db = next(db_session_generator)
        try:
            yield db
        finally:
            next(db_session_generator, None)

    # Rota de Login (sem mudanças)
    @app.route('/api/login', methods=['POST'])
    def login():
        db: Session = next(get_db())
        data = request.get_json()
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Usuário e senha são obrigatórios'}), 400
        username = data.get('username')
        password = data.get('password')
        user = db.query(User).filter(User.username == username).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Usuário ou senha incorretos'}), 401
        secret_key = current_app.config['JWT_SECRET_KEY']
        token_payload = {
            'user_id': user.id,
            'username': user.username,
            'exp': datetime.utcnow() + timedelta(hours=8)
        }
        token = jwt.encode(token_payload, secret_key, algorithm="HS256")
        return jsonify({'token': token})


    # --- Rotas Públicas ---

    # (Rotas de Projects: GET, ranked, vote ... sem mudanças)
    @app.route('/api/projects', methods=['GET'])
    def get_projects():
        db: Session = next(get_db())
        projects_query = db.query(Project).order_by(Project.area_saber, Project.materia).all()
        grouped_projects = defaultdict(list)
        for project in projects_query:
            project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
            grouped_projects[project.area_saber].append(project_dict)
        return jsonify(grouped_projects)

    @app.route('/api/projects/ranked', methods=['GET'])
    def get_ranked_projects():
        db: Session = next(get_db())
        try:
            projects_query = db.query(Project).order_by(Project.votes.desc()).all()
            projects_list = []
            has_votes = False
            for project in projects_query:
                if project.votes > 0: has_votes = True
                project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
                projects_list.append(project_dict)
            return jsonify({'hasVotes': has_votes, 'projects': projects_list})
        except Exception as e:
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    @app.route('/api/projects/<int:project_id>/vote', methods=['POST'])
    def vote_project(project_id):
        db: Session = next(get_db())
        project = db.query(Project).filter(Project.id == project_id).first()
        if project is None:
            return jsonify({'error': 'Projeto não encontrado'}), 404
        project.votes += 1
        db.commit()
        db.refresh(project)
        project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
        return jsonify(project_dict)

    @app.route('/api/contact', methods=['POST'])
    def handle_contact():
        data = request.get_json()
        name, email, message = data.get('name'), data.get('email'), data.get('message')
        if not name or not email or not message:
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        db: Session = next(get_db())
        new_contact = Contact(name=name, email=email, message=message)
        db.add(new_contact)
        db.commit()
        return jsonify({'success': 'Mensagem enviada com sucesso!'}), 201

    # =========================================================
    # === ROTA: GET Hobbies (Pública) =========================
    # =========================================================
    @app.route('/api/hobbies', methods=['GET'])
    def get_hobbies():
        db: Session = next(get_db())
        try:
            # Ordenar por ID para que os mais novos apareçam por último
            hobbies_query = db.query(Hobby).order_by(Hobby.id.asc()).all()
            hobbies_list = []
            for hobby in hobbies_query:
                hobby_dict = {c.name: getattr(hobby, c.name) for c in hobby.__table__.columns}
                hobbies_list.append(hobby_dict)
            return jsonify(hobbies_list)
        except Exception as e:
            print(f"Erro ao buscar hobbies: {e}")
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    # --- Rotas Protegidas ---

    # (Rotas de Projects [POST, GET ID, PUT, DELETE] ... sem mudanças)
    @app.route('/api/projects', methods=['POST'])
    @token_required
    def add_project():
        db: Session = next(get_db())
        data = request.form
        if not data or not data.get('name') or not data.get('area_saber') or not data.get('materia'):
            return jsonify({'error': 'Campos obrigatórios (nome, area_saber, materia) estão faltando.'}), 400
        try:
            image_url_to_save = None
            if 'image_file' in request.files:
                file_to_upload = request.files['image_file']
                if file_to_upload.filename != '':
                    upload_result = cloudinary.uploader.upload(file_to_upload)
                    image_url_to_save = upload_result.get('secure_url')
            elif 'image_url' in data and data.get('image_url'):
                image_url_to_save = data.get('image_url')
            new_project = Project(
                name=data.get('name'), description=data.get('description', ''), 
                area_saber=data.get('area_saber'), materia=data.get('materia'),
                image_url=image_url_to_save, project_link=data.get('project_link') or None,
                votes=0
            )
            db.add(new_project)
            db.commit()
            db.refresh(new_project) 
            new_project_dict = {c.name: getattr(new_project, c.name) for c in new_project.__table__.columns}
            return jsonify(new_project_dict), 201
        except Exception as e:
            db.rollback()
            print(f"Erro ao adicionar projeto: {e}") 
            if hasattr(e, 'message'): return jsonify({'error': f'Erro: {e.message}'}), 500
            return jsonify({'error': f'Erro interno do servidor: {str(e)}'}), 500

    @app.route('/api/projects/<int:project_id>', methods=['GET'])
    @token_required
    def get_project_by_id(project_id):
        db: Session = next(get_db())
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project is None: return jsonify({'error': 'Projeto não encontrado'}), 404
            project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
            return jsonify(project_dict), 200
        except Exception as e:
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    @app.route('/api/projects/<int:project_id>', methods=['PUT'])
    @token_required
    def update_project(project_id):
        db: Session = next(get_db())
        data = request.form
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project is None: return jsonify({'error': 'Projeto não encontrado'}), 404
            image_url_to_save = project.image_url 
            if 'image_file' in request.files:
                file_to_upload = request.files['image_file']
                if file_to_upload.filename != '':
                    upload_result = cloudinary.uploader.upload(file_to_upload)
                    image_url_to_save = upload_result.get('secure_url')
            elif 'image_url' in data:
                # Permite limpar a URL enviando um campo vazio
                image_url_to_save = data.get('image_url') or None
            project.name = data.get('name')
            project.description = data.get('description', '')
            project.area_saber = data.get('area_saber')
            project.materia = data.get('materia')
            project.image_url = image_url_to_save
            project.project_link = data.get('project_link') or None
            db.commit()
            db.refresh(project)
            project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
            return jsonify(project_dict), 200
        except Exception as e:
            db.rollback()
            print(f"Erro ao atualizar projeto: {e}")
            if hasattr(e, 'message'): return jsonify({'error': f'Erro: {e.message}'}), 500
            return jsonify({'error': f'Erro interno do servidor: {str(e)}'}), 500

    @app.route('/api/projects/<int:project_id>', methods=['DELETE'])
    @token_required 
    def delete_project(project_id):
        db: Session = next(get_db())
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project is None: return jsonify({'error': 'Projeto não encontrado'}), 404
            db.delete(project)
            db.commit()
            return jsonify({'success': 'Projeto apagado com sucesso!'}), 200
        except Exception as e:
            db.rollback()
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    # (Rotas de Messages, Reset, Credentials ... sem mudanças)
    @app.route('/api/messages', methods=['GET'])
    @token_required 
    def get_messages():
        db: Session = next(get_db())
        messages_query = db.query(Contact).order_by(Contact.timestamp.desc()).all()
        messages_list = []
        for msg in messages_query:
            msg_dict = {c.name: getattr(msg, c.name) for c in msg.__table__.columns}
            if 'timestamp' in msg_dict and msg_dict['timestamp']:
                 msg_dict['timestamp'] = msg_dict['timestamp'].isoformat()
            else: msg_dict['timestamp'] = None
            messages_list.append(msg_dict)
        return jsonify(messages_list)
    
    @app.route('/api/admin/reset-votes', methods=['POST'])
    @token_required 
    def reset_all_votes():
        db: Session = next(get_db())
        try:
            db.query(Project).update({Project.votes: 0})
            db.commit()
            return jsonify({'status': 'success', 'message': 'Todos os votos foram resetados.'})
        except Exception as e:
            db.rollback()
            return jsonify({'status': 'error', 'message': f'Erro ao resetar votos: {e}'}), 500

    @app.route('/api/admin/reset-messages', methods=['POST'])
    @token_required 
    def reset_all_messages():
        db: Session = next(get_db())
        try:
            db.query(Contact).delete()
            db.commit()
            return jsonify({'status': 'success', 'message': 'Todas as mensagens foram apagadas.'})
        except Exception as e:
            db.rollback()
            return jsonify({'status': 'error', 'message': f'Erro ao apagar mensagens: {e}'}), 500
            
    @app.route('/api/admin/credentials', methods=['PUT'])
    @token_required
    def update_admin_credentials():
        db: Session = next(get_db())
        data = request.get_json()
        current_password = data.get('current_password')
        new_username = data.get('new_username')
        new_password = data.get('new_password')
        if not current_password: return jsonify({'error': 'Senha atual é obrigatória para verificação.'}), 400
        user_id = g.current_user_id 
        user = db.query(User).filter(User.id == user_id).first()
        if not user: return jsonify({'error': 'Usuário não encontrado.'}), 404
        if not user.check_password(current_password): return jsonify({'error': 'Senha atual incorreta.'}), 403
        new_username = new_username.strip() if new_username else None
        new_password = new_password.strip() if new_password else None
        if not new_username and not new_password: return jsonify({'error': 'Você deve fornecer um novo usuário ou uma nova senha.'}), 400
        username_is_same = new_username and new_username == user.username
        password_is_same = new_password and user.check_password(new_password)
        if username_is_same and password_is_same: return jsonify({'error': 'O novo nome de usuário e a nova senha não podem ser iguais aos atuais.'}), 409
        if username_is_same: return jsonify({'error': 'O novo nome de usuário não pode ser igual ao atual.'}), 409
        if password_is_same: return jsonify({'error': 'A nova senha não pode ser igual à atual.'}), 409
        try:
            if new_username: user.username = new_username
            if new_password: user.set_password(new_password)
            db.commit()
            return jsonify({'status': 'success', 'message': 'Credenciais atualizadas! Por favor, faça login novamente.'}), 200
        except IntegrityError:
            db.rollback()
            return jsonify({'error': 'Esse nome de usuário já está em uso.'}), 409
        except Exception as e:
            db.rollback()
            return jsonify({'error': f'Erro interno: {e}'}), 500

    # =========================================================
    # === ROTA: POST Hobby (Privada) ==========================
    # =========================================================
    @app.route('/api/hobbies', methods=['POST'])
    @token_required
    def add_hobby():
        db: Session = next(get_db())
        data = request.form
        if not data or not data.get('title') or not data.get('description'):
            return jsonify({'error': 'Campos obrigatórios (título, descrição) estão faltando.'}), 400
        try:
            image_url_to_save = None
            if 'image_file' in request.files:
                file_to_upload = request.files['image_file']
                if file_to_upload.filename != '':
                    upload_result = cloudinary.uploader.upload(file_to_upload)
                    image_url_to_save = upload_result.get('secure_url')
            elif 'image_url' in data and data.get('image_url'):
                image_url_to_save = data.get('image_url')
            new_hobby = Hobby(
                title=data.get('title'),
                description=data.get('description'),
                image_url=image_url_to_save
            )
            db.add(new_hobby)
            db.commit()
            db.refresh(new_hobby)
            new_hobby_dict = {c.name: getattr(new_hobby, c.name) for c in new_hobby.__table__.columns}
            return jsonify(new_hobby_dict), 201
        except Exception as e:
            db.rollback()
            print(f"Erro ao adicionar hobby: {e}") 
            if hasattr(e, 'message'): return jsonify({'error': f'Erro: {e.message}'}), 500
            return jsonify({'error': f'Erro interno do servidor: {str(e)}'}), 500

    # =========================================================
    # === ROTA: DELETE Hobby (Privada) ========================
    # =========================================================
    @app.route('/api/hobbies/<int:hobby_id>', methods=['DELETE'])
    @token_required 
    def delete_hobby(hobby_id):
        db: Session = next(get_db())
        try:
            hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
            if hobby is None:
                return jsonify({'error': 'Hobby não encontrado'}), 404
            db.delete(hobby)
            db.commit()
            return jsonify({'success': 'Hobby apagado com sucesso!'}), 200
        except Exception as e:
            db.rollback()
            print(f"Erro ao deletar hobby: {e}")
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    # =========================================================
    # === NOVA ROTA: GET Hobby por ID (Privada) ===============
    # =========================================================
    @app.route('/api/hobbies/<int:hobby_id>', methods=['GET'])
    @token_required
    def get_hobby_by_id(hobby_id):
        db: Session = next(get_db())
        try:
            hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
            if hobby is None:
                return jsonify({'error': 'Hobby não encontrado'}), 404
            hobby_dict = {c.name: getattr(hobby, c.name) for c in hobby.__table__.columns}
            return jsonify(hobby_dict), 200
        except Exception as e:
            print(f"Erro ao buscar hobby por ID: {e}")
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    # =========================================================
    # === NOVA ROTA: PUT Hobby (Privada) ======================
    # =========================================================
    @app.route('/api/hobbies/<int:hobby_id>', methods=['PUT'])
    @token_required
    def update_hobby(hobby_id):
        db: Session = next(get_db())
        data = request.form
        if not data or not data.get('title') or not data.get('description'):
            return jsonify({'error': 'Campos obrigatórios (título, descrição) estão faltando.'}), 400
        try:
            hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
            if hobby is None:
                return jsonify({'error': 'Hobby não encontrado'}), 404

            # Lógica de imagem idêntica ao update_project
            image_url_to_save = hobby.image_url 
            if 'image_file' in request.files:
                file_to_upload = request.files['image_file']
                if file_to_upload.filename != '':
                    upload_result = cloudinary.uploader.upload(file_to_upload)
                    image_url_to_save = upload_result.get('secure_url')
            elif 'image_url' in data:
                image_url_to_save = data.get('image_url') or None
            
            hobby.title = data.get('title')
            hobby.description = data.get('description')
            hobby.image_url = image_url_to_save
            
            db.commit()
            db.refresh(hobby)
            hobby_dict = {c.name: getattr(hobby, c.name) for c in hobby.__table__.columns}
            return jsonify(hobby_dict), 200
        except Exception as e:
            db.rollback()
            print(f"Erro ao atualizar hobby: {e}")
            if hasattr(e, 'message'): return jsonify({'error': f'Erro: {e.message}'}), 500
            return jsonify({'error': f'Erro interno do servidor: {str(e)}'}), 500