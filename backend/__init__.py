from flask import Flask
from flask_cors import CORS

def create_app():
    # Cria a instância da aplicação Flask
    app = Flask(__name__)
    CORS(app) # Habilita o CORS para a aplicação inteira

    # Importa e registra o módulo do banco de dados
    from . import database
    database.init_app(app)

    # Importa e registra o módulo de rotas
    from . import routes
    routes.init_routes(app)

    # Retorna a aplicação criada e configurada
    return app