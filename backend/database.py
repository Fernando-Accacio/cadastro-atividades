import sqlite3
import click
from flask.cli import with_appcontext

def get_db():
    conn = sqlite3.connect('backend/portfolio.db') 
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DROP TABLE IF EXISTS projects")
    cursor.execute("DROP TABLE IF EXISTS contacts")

    cursor.execute("""
    CREATE TABLE projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        area_saber TEXT NOT NULL, 
        materia TEXT NOT NULL,
        image_url TEXT,
        project_link TEXT,
        votes INTEGER NOT NULL DEFAULT 0
    )
    """)
    # ... (criação da tabela contacts omitida para brevidade) ...
    cursor.execute("""
    CREATE TABLE contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # PROJETOS INSERIDOS APENAS DE EXEMPLO

    sample_projects = [
        # Linguagens
        ('Análise Literária de Dom Casmurro', 'Um ensaio aprofundado sobre a obra de Machado de Assis.', 'Linguagens', 'Português', '/images/portugues.png', None, 0),
        ('Shakespeare in Modern English', 'Tradução e análise de um soneto de Shakespeare.', 'Linguagens', 'Inglês', None, 'https://github.com', 0),
        ('Estudo sobre o Tarsila do Amaral', 'Uma apresentação sobre o movimento modernista brasileiro.', 'Linguagens', 'Artes', '/images/artes.png', None, 0),
        ('A Importância do Alongamento', 'Desenvolvimento de uma série de exercícios de alongamento.', 'Linguagens', 'Educação Física', '/images/educacao_fisica.png', None, 0),
        
        # Ciências da Natureza
        ('Ciclo da Água na Prática', 'Criação de um terrário fechado para demonstrar o ciclo da água.', 'Ciências da Natureza', 'Biologia', '/images/biologia.png', None, 0),
        ('Reações de Oxirredução', 'Relatório de laboratório sobre experimentos com reações.', 'Ciências da Natureza', 'Química', '/images/quimica.png', None, 0),
        ('Construção de um Eletroímã', 'Projeto prático de construção de um eletroímã.', 'Ciências da Natureza', 'Física', None, 'https://github.com', 0),
        
        # Matemática
        ('Aplicação de Funções Trigonométricas', 'Um estudo de caso aplicando seno e cosseno.', 'Matemática', 'Matemática', '/images/matematica.png', None, 0),
        
        # Ciências Humanas (mantivemos as alterações anteriores)
        ('A Revolução Francesa e seus Impactos', 'Artigo sobre as consequências sociais e políticas.', 'Ciências Humanas', 'História', '/images/historia.png', None, 0),
        ('Análise da Urbanização Brasileira', 'Um mapa comentado sobre o crescimento das cidades.', 'Ciências Humanas', 'Geografia', '/images/geografia.png', None, 0),
        ('O Contrato Social de Rousseau', 'Fichamento e análise crítica da principal obra de Rousseau.', 'Ciências Humanas', 'Filosofia', None, 'https://github.com', 0),
        ('As Classes Sociais em Karl Marx', 'Apresentação sobre a teoria das classes sociais.', 'Ciências Humanas', 'Sociologia', '/images/sociologia.png', 'https://github.com', 0),
        ('As Classes Sociais em Karl Marx', 'Apresentação sobre a teoria das classes sociais.', 'Ciências Humanas', 'Sociologia', '/images/sociologia.png', 'https://github.com', 0),


        # Técnico/Profissionalizante
        ('Sensor de Umidade com Arduino', 'Projeto de IoT para monitorar a umidade do solo.', 'Técnico/Profissionalizante', 'IoT', '/images/iot.png', None, 0)
    ]
    
    cursor.executemany("INSERT INTO projects (name, description, area_saber, materia, image_url, project_link, votes) VALUES (?, ?, ?, ?, ?, ?, ?)", sample_projects)

    print("Banco de dados inicializado e populado com dados de exemplo.")
    
    db.commit()
    db.close()

@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Banco de dados inicializado.')

@click.command('reset-votes')
@with_appcontext
def reset_votes_command():
    db = get_db()
    db.execute('UPDATE projects SET votes = 0')
    db.commit()
    db.close()
    click.echo('A contagem de votos de todos os projetos foi resetada para 0.')

@click.command('reset-messages')
@with_appcontext
def reset_messages_command():
    db = get_db()
    db.execute('DELETE FROM contacts')
    db.commit()
    db.close()
    click.echo('Todas as mensagens de contato foram apagadas.')

def init_app(app):
    app.cli.add_command(init_db_command)
    app.cli.add_command(reset_votes_command)
    app.cli.add_command(reset_messages_command)