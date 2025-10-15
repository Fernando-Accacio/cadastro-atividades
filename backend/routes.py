from flask import request, jsonify
from backend.database import get_db 
from collections import defaultdict

def init_routes(app):
    @app.route('/api/projects', methods=['GET'])
    def get_projects():
        conn = get_db()
        projects_cursor = conn.execute('SELECT * FROM projects ORDER BY area_saber, materia').fetchall()
        conn.close()
        
        grouped_projects = defaultdict(list)
        for project in projects_cursor:
            grouped_projects[project['area_saber']].append(dict(project))
            
        return jsonify(grouped_projects)

@app.route('/api/projects/ranked', methods=['GET'])
def get_ranked_projects():
    conn = get_db()
    projects_cursor = conn.execute('SELECT * FROM projects ORDER BY votes DESC').fetchall()
    conn.close()
    projects_list = [dict(row) for row in projects_cursor]

    has_votes = any(p['votes'] > 0 for p in projects_list)
    
    if not has_votes:
        return jsonify({'hasVotes': False, 'projects': []})
    
    return jsonify({'hasVotes': True, 'projects': projects_list})


    @app.route('/api/projects/<int:project_id>/vote', methods=['POST'])
    def vote_project(project_id):
        conn = get_db()
        conn.execute('UPDATE projects SET votes = votes + 1 WHERE id = ?', (project_id,))
        conn.commit()
        project = conn.execute('SELECT * FROM projects WHERE id = ?', (project_id,)).fetchone()
        conn.close()
        if project is None:
            return jsonify({'error': 'Projeto não encontrado'}), 404
        return jsonify(dict(project))

    @app.route('/api/contact', methods=['POST'])
    def handle_contact():
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400

        conn = get_db()
        conn.execute('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
                     (name, email, message))
        conn.commit()
        conn.close()
        return jsonify({'success': 'Mensagem enviada com sucesso!'}), 201

    @app.route('/api/messages', methods=['GET'])
    def get_messages():
        conn = get_db()
        messages_cursor = conn.execute('SELECT * FROM contacts ORDER BY timestamp DESC').fetchall()
        conn.close()
        messages_list = [dict(row) for row in messages_cursor]
        return jsonify(messages_list)
    
    @app.route('/api/admin/reset-votes', methods=['POST'])
    def reset_all_votes():
        conn = get_db()
        conn.execute('UPDATE projects SET votes = 0')
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Todos os votos foram resetados.'})

    @app.route('/api/admin/reset-messages', methods=['POST'])
    def reset_all_messages():
        conn = get_db()
        conn.execute('DELETE FROM contacts')
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Todas as mensagens foram apagadas.'})