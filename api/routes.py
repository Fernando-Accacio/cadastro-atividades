from flask import request, jsonify
from sqlalchemy.orm import Session
from collections import defaultdict
from .models import SessionLocal, Project, Contact

def init_routes(app):

    def get_db():
        db = SessionLocal()
        try:
            return db
        except:
            db.close()
            raise

    @app.route('/api/projects', methods=['GET'])
    def get_projects():
        db = get_db()
        try:
            projects_query = db.query(Project).order_by(Project.area_saber, Project.materia).all()
            
            grouped_projects = defaultdict(list)
            for project in projects_query:
                project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
                grouped_projects[project.area_saber].append(project_dict)
                
            return jsonify(grouped_projects)
        finally:
            db.close()

    @app.route('/api/projects/ranked', methods=['GET'])
    def get_ranked_projects():
        db = get_db()
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
        finally:
            db.close()

    @app.route('/api/projects/<int:project_id>/vote', methods=['POST'])
    def vote_project(project_id):
        db = get_db()
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            
            if project is None:
                return jsonify({'error': 'Projeto não encontrado'}), 404
                
            project.votes += 1
            db.commit()
            db.refresh(project)
            
            project_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
            return jsonify(project_dict)
        finally:
            db.close()

    @app.route('/api/contact', methods=['POST'])
    def handle_contact():
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400

        db = get_db()
        try:
            new_contact = Contact(name=name, email=email, message=message)
            db.add(new_contact)
            db.commit()
            
            return jsonify({'success': 'Mensagem enviada com sucesso!'}), 201
        finally:
            db.close()

    @app.route('/api/messages', methods=['GET'])
    def get_messages():
        db = get_db()
        try:
            messages_query = db.query(Contact).order_by(Contact.timestamp.desc()).all()
            
            messages_list = []
            for msg in messages_query:
                msg_dict = {c.name: getattr(msg, c.name) for c in msg.__table__.columns}
                # Converte datetime para string ISO para evitar problemas de serialização JSON
                if 'timestamp' in msg_dict and msg_dict['timestamp']:
                    msg_dict['timestamp'] = msg_dict['timestamp'].isoformat()
                messages_list.append(msg_dict)
                
            return jsonify(messages_list)
        finally:
            db.close()
    
    # --- ROTAS PARA O PAINEL ADMIN ---

    @app.route('/api/admin/reset-votes', methods=['POST'])
    def reset_all_votes():
        db = get_db()
        try:
            db.query(Project).update({Project.votes: 0})
            db.commit()
            return jsonify({'status': 'success', 'message': 'Todos os votos foram resetados.'})
        except Exception as e:
            db.rollback()
            return jsonify({'status': 'error', 'message': f'Erro ao resetar votos: {e}'}), 500
        finally:
            db.close()

    @app.route('/api/admin/reset-messages', methods=['POST'])
    def reset_all_messages():
        db = get_db()
        try:
            db.query(Contact).delete()
            db.commit()
            return jsonify({'status': 'success', 'message': 'Todas as mensagens foram apagadas.'})
        except Exception as e:
            db.rollback()
            return jsonify({'status': 'error', 'message': f'Erro ao apagar mensagens: {e}'}), 500
        finally:
            db.close()