# api/__init__.py

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv # Importado primeiro
import os

# Carrega as variáveis de ambiente ANTES de qualquer outra coisa
load_dotenv() 

def create_app():
    app = Flask(__name__)
    
    # Configuração de CORS atualizada
    CORS(app, resources={
        r"/api/*": {
            "origins": "*", 
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Carrega a URL do banco
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise RuntimeError("DATABASE_URL não está configurada!")
    
    # Carrega a nova chave secreta do JWT (agora deve funcionar)
    jwt_secret = os.environ.get('JWT_SECRET_KEY')
    if not jwt_secret:
        raise RuntimeError("JWT_SECRET_KEY não está configurada!")
    
    app.config['JWT_SECRET_KEY'] = jwt_secret

    from . import database
    database.init_app(app)

    from . import routes
    routes.init_routes(app)

    return app

app = create_app()