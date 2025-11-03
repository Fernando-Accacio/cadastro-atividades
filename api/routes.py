from flask import request, jsonify, current_app, g
from sqlalchemy.orm import Session
from collections import defaultdict
# Importamos o novo modelo 'User'
from .models import get_db_session, Project, Contact, User
# Imports para JWT (Login)
import jwt
from datetime import datetime, timedelta
from functools import wraps

# =========================================================
# === NOVO DECORADOR: VERIFICA O TOKEN DE LOGIN ===========
# =========================================================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Verifica se o 'Authorization' header foi enviado
        if 'Authorization' in request.headers:
            # Espera um header "Bearer <token>"
            token_str = request.headers['Authorization']
            if token_str.startswith('Bearer '):
                token = token_str.split(' ')[1]

        if not token:
            return jsonify({'error': 'Token de autenticação está faltando!'}), 401

        try:
            # Decodifica o token usando a chave secreta
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

    # =========================================================
    # === NOVA ROTA: LOGIN DO ADMIN ===========================
    # =========================================================
    @app.route('/api/login', methods=['POST'])
    def login():
        db: Session = next(get_db())
        data = request.get_json()
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Usuário e senha são obrigatórios'}), 400
        
        username = data.get('username')
        password = data.get('password')
        
        user = db.query(User).filter(User.username == username).first()
        
        # Verifica o usuário E a senha hasheada
        if not user or not user.check_password(password):
            return jsonify({'error': 'Usuário ou senha incorretos'}), 401
            
        # Senha correta! Gera um token JWT
        secret_key = current_app.config['JWT_SECRET_KEY']
        token_payload = {
            'user_id': user.id,
            'username': user.username,
            'exp': datetime.utcnow() + timedelta(hours=8) # Token expira em 8 horas
        }
        token = jwt.encode(token_payload, secret_key, algorithm="HS256")
        
        return jsonify({'token': token})

    # --- Rotas Públicas (Não precisam de login) ---

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
                if project.votes > 0:
                    has_votes = True
                project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
                projects_list.append(project_dict)
                
            return jsonify({'hasVotes': has_votes, 'projects': projects_list})
            
        except Exception as e:
            print(f"Erro ao buscar ranking: {e}")
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
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400

        db: Session = next(get_db())
        new_contact = Contact(name=name, email=email, message=message)
        db.add(new_contact)
        db.commit()
        
        return jsonify({'success': 'Mensagem enviada com sucesso!'}), 201
    
    # --- Rotas Protegidas (Precisa de login/token) ---

    @app.route('/api/projects', methods=['POST'])
    @token_required # <-- ROTA PROTEGIDA
    def add_project():
        db: Session = next(get_db())
        data = request.get_json()

        if not data or not data.get('name') or not data.get('area_saber') or not data.get('materia'):
            return jsonify({'error': 'Campos obrigatórios (nome, area_saber, materia) estão faltando.'}), 400

        try:
            new_project = Project(
                name=data.get('name'),
                description=data.get('description', ''), 
                area_saber=data.get('area_saber'),
                materia=data.get('materia'),
                image_url=data.get('image_url') or None, 
                project_link=data.get('project_link') or None,
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
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    @app.route('/api/projects/<int:project_id>', methods=['GET'])
    @token_required # <-- ROTA PROTEGIDA
    def get_project_by_id(project_id):
        db: Session = next(get_db())
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project is None:
                return jsonify({'error': 'Projeto não encontrado'}), 404
            project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
            return jsonify(project_dict), 200
        except Exception as e:
            print(f"Erro ao buscar projeto por ID: {e}")
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    @app.route('/api/projects/<int:project_id>', methods=['PUT'])
    @token_required # <-- ROTA PROTEGIDA
    def update_project(project_id):
        db: Session = next(get_db())
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('area_saber') or not data.get('materia'):
            return jsonify({'error': 'Campos obrigatórios (nome, area_saber, materia) estão faltando.'}), 400
            
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project is None:
                return jsonify({'error': 'Projeto não encontrado'}), 404
            
            project.name = data.get('name')
            project.description = data.get('description', '')
            project.area_saber = data.get('area_saber')
            project.materia = data.get('materia')
            project.image_url = data.get('image_url') or None
            project.project_link = data.get('project_link') or None
            
            db.commit()
            db.refresh(project)
            project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
            return jsonify(project_dict), 200
        except Exception as e:
            db.rollback()
            print(f"Erro ao atualizar projeto: {e}")
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    @app.route('/api/projects/<int:project_id>', methods=['DELETE'])
    @token_required # <-- ROTA PROTEGIDA
    def delete_project(project_id):
        db: Session = next(get_db())
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project is None:
                return jsonify({'error': 'Projeto não encontrado'}), 404
            
            db.delete(project)
            db.commit()
            return jsonify({'success': 'Projeto apagado com sucesso!'}), 200
        except Exception as e:
            db.rollback()
            print(f"Erro ao deletar projeto: {e}")
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    @app.route('/api/messages', methods=['GET'])
    @token_required # <-- ROTA PROTEGIDA
    def get_messages():
        db: Session = next(get_db())
        messages_query = db.query(Contact).order_by(Contact.timestamp.desc()).all()
        
        messages_list = []
        for msg in messages_query:
            msg_dict = {c.name: getattr(msg, c.name) for c in msg.__table__.columns}
            if 'timestamp' in msg_dict and msg_dict['timestamp']:
                 msg_dict['timestamp'] = msg_dict['timestamp'].isoformat()
            else:
                 msg_dict['timestamp'] = None
                 
            messages_list.append(msg_dict)
            
        return jsonify(messages_list)
    
    @app.route('/api/admin/reset-votes', methods=['POST'])
    @token_required # <-- ROTA PROTEGIDA
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
    @token_required # <-- ROTA PROTEGIDA
    def reset_all_messages():
        db: Session = next(get_db())
        try:
            db.query(Contact).delete()
            db.commit()
            return jsonify({'status': 'success', 'message': 'Todas as mensagens foram apagadas.'})
        except Exception as e:
            db.rollback()
            return jsonify({'status': 'error', 'message': f'Erro ao apagar mensagens: {e}'}), 500
        
    # =========================================================
    # === NOVA ROTA: ALTERAR CREDENCIAIS DO ADMIN ============
    # =========================================================
    @app.route('/api/admin/credentials', methods=['PUT'])
    @token_required # <-- ROTA PROTEGIDA
    def update_admin_credentials():
        db: Session = next(get_db())
        data = request.get_json()
        
        # Pega os dados do formulário
        current_password = data.get('current_password')
        new_username = data.get('new_username')
        new_password = data.get('new_password')

        if not current_password:
            return jsonify({'error': 'Senha atual é obrigatória para verificação.'}), 400

        # Pega o ID do usuário que o decorador @token_required salvou
        user_id = g.current_user_id 
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return jsonify({'error': 'Usuário não encontrado.'}), 404

        # 1. Verifica a senha atual
        if not user.check_password(current_password):
            return jsonify({'error': 'Senha atual incorreta.'}), 403 # 403 Forbidden

        try:
            changes_made = False
            # 2. Atualiza o username (se foi fornecido e é diferente)
            if new_username and new_username != user.username:
                user.username = new_username
                changes_made = True

            # 3. Atualiza a senha (se foi fornecida)
            if new_password:
                user.set_password(new_password)
                changes_made = True

            if not changes_made:
                return jsonify({'message': 'Nenhum dado novo fornecido para alteração.'}), 200

            db.commit()
            
            # Retorna uma mensagem de sucesso. 
            # O frontend deve FORÇAR O LOGOUT para o usuário logar com as novas credenciais.
            return jsonify({'status': 'success', 'message': 'Credenciais atualizadas! Por favor, faça login novamente.'}), 200

        except IntegrityError:
            # Erro caso o 'new_username' já exista no banco
            db.rollback()
            return jsonify({'error': 'Esse nome de usuário já está em uso.'}), 409 # 409 Conflict
        except Exception as e:
            db.rollback()
            return jsonify({'error': f'Erro interno: {e}'}), 500

    
    # --- Rotas Públicas (Não precisam de login) ---
    # @app.route('/api/projects', methods=['GET'])
    # ... (o resto do seu arquivo routes.py continua) ...