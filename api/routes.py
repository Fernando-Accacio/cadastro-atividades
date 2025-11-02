from flask import request, jsonify, current_app
from sqlalchemy.orm import Session
from collections import defaultdict
from .models import get_db_session, Project, Contact 

def init_routes(app):

    def get_db():
        db_session_generator = get_db_session()
        db = next(db_session_generator)
        try:
            yield db
        finally:
            next(db_session_generator, None)

    @app.route('/api/projects', methods=['GET'])
    def get_projects():
        db: Session = next(get_db())
        projects_query = db.query(Project).order_by(Project.area_saber, Project.materia).all()
        
        grouped_projects = defaultdict(list)
        for project in projects_query:
            project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
            grouped_projects[project.area_saber].append(project_dict)
            
        return jsonify(grouped_projects)

    # =========================================================
    # === ROTA FALTANTE: BUSCAR O RANKING (PARA A PÁGINA RANKING)
    # =========================================================
    @app.route('/api/projects/ranked', methods=['GET'])
    def get_ranked_projects():
        db: Session = next(get_db())
        try:
            # Ordena os projetos pelos votos, do maior para o menor
            projects_query = db.query(Project).order_by(Project.votes.desc()).all()
            
            projects_list = []
            has_votes = False
            for project in projects_query:
                if project.votes > 0:
                    has_votes = True
                project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
                projects_list.append(project_dict)
                
            # Retorna o JSON no formato que o RankingPage.js espera
            return jsonify({'hasVotes': has_votes, 'projects': projects_list})
            
        except Exception as e:
            print(f"Erro ao buscar ranking: {e}")
            return jsonify({'error': f'Erro interno do servidor: {e}'}), 500

    @app.route('/api/projects', methods=['POST'])
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

    @app.route('/api/projects/<int:project_id>', methods=['DELETE'])
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

    @app.route('/api/messages', methods=['GET'])
    def get_messages():
        db: Session = next(get_db())
        messages_query = db.query(Contact).order_by(Contact.timestamp.desc()).all()
        
        messages_list = []
        for msg in messages_query:
            msg_dict = {c.name: getattr(msg, c.name) for c in msg.__table__.columns}
            if 'timestamp' in msg_dict and msg_dict['timestamp']:
                 msg_dict['timestamp'] = msg_dict['timestamp'].isoformat()
            messages_list.append(msg_dict)
            
        return jsonify(messages_list)
    
    @app.route('/api/admin/reset-votes', methods=['POST'])
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
    def reset_all_messages():
        db: Session = next(get_db())
        try:
            db.query(Contact).delete()
            db.commit()
            return jsonify({'status': 'success', 'message': 'Todas as mensagens foram apagadas.'})
        except Exception as e:
            db.rollback()
            return jsonify({'status': 'error', 'message': f'Erro ao apagar mensagens: {e}'}), 500