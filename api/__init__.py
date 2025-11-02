from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv # Para carregar variáveis do .env
import os

# Carrega as variáveis do arquivo .env (importante para rodar localmente)
load_dotenv() 

def create_app():
    app = Flask(__name__)
    
    # Configuração de CORS explícita para permitir PUT
    CORS(app, resources={
        r"/api/*": {
            "origins": "*", # Em produção, troque "*" por "https://seu-site.vercel.app"
            "methods": ["GET", "POST", "DELETE", "PUT", "OPTIONS"], # <-- 'PUT' ADICIONADO
            "allow_headers": ["Content-Type"]
        }
    })

    # Configura a URL do banco a partir da variável de ambiente
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise RuntimeError("DATABASE_URL não está configurada!")
    
    # Importa e registra o módulo do banco de dados
    from . import database
    database.init_app(app)

    # Importa e registra o módulo de rotas
    from . import routes
    routes.init_routes(app)

    return app

app = create_app()