import click
from flask.cli import with_appcontext
from sqlalchemy.orm import Session
from .models import engine, SessionLocal, Project, Contact, create_tables

# Função helper para usar a sessão nos comandos CLI
def db_session_decorator(func):
    @with_appcontext
    def wrapper(*args, **kwargs):
        db: Session = SessionLocal()
        try:
            result = func(db, *args, **kwargs)
            db.commit() # Commita a transação se a função foi bem-sucedida
            return result
        except Exception as e:
            db.rollback() # Desfaz em caso de erro
            click.echo(f"Erro no banco de dados: {e}")
            raise
        finally:
            db.close()
    # Copia metadados da função original para o wrapper (importante para o Flask CLI)
    wrapper.__name__ = func.__name__
    wrapper.__doc__ = func.__doc__
    return wrapper

@click.command('init-db')
@with_appcontext # Não precisa da sessão, pois só cria as tabelas
def init_db_command():
    """Cria as tabelas do banco de dados se não existirem."""
    try:
        create_tables()
        click.echo('Tabelas criadas com sucesso (se não existiam).')
        # Opcional: Adicionar dados iniciais aqui se desejar, usando a sessão
        # add_initial_data()
    except Exception as e:
        click.echo(f"Erro ao criar tabelas: {e}")

@click.command('reset-votes')
@db_session_decorator
def reset_votes_command(db: Session):
    """Reseta a contagem de votos de todos os projetos para 0."""
    updated_count = db.query(Project).update({Project.votes: 0})
    click.echo(f'{updated_count} projetos tiveram seus votos resetados para 0.')

@click.command('reset-messages')
@db_session_decorator
def reset_messages_command(db: Session):
    """Apaga todas as mensagens da tabela de contatos."""
    deleted_count = db.query(Contact).delete()
    click.echo(f'{deleted_count} mensagens de contato foram apagadas.')

# Opcional: Função para adicionar dados iniciais (se você quiser)
# @db_session_decorator
# def add_initial_data(db: Session):
#     # Verifica se já existem projetos para não duplicar
#     if db.query(Project).count() == 0:
#         sample_projects_data = [
#             {'name': 'Análise Literária...', 'description': '...', 'area_saber': 'Linguagens', 'materia': 'Português', 'image_url': '/images/portugues.png'},
#             # ... Adicione os outros projetos aqui no formato de dicionário ...
#         ]
#         for data in sample_projects_data:
#             db.add(Project(**data))
#         click.echo('Dados iniciais dos projetos adicionados.')
#     else:
#         click.echo('Banco já contém projetos. Dados iniciais não adicionados.')

def init_app(app):
    app.cli.add_command(init_db_command)
    app.cli.add_command(reset_votes_command)
    app.cli.add_command(reset_messages_command)
    # Se você criar a função add_initial_data, descomente a linha abaixo
    # app.cli.add_command(click.command('seed-db')(add_initial_data))