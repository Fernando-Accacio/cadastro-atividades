import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

# Verifica se a DATABASE_URL está configurada
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    print("ERRO: Variável de ambiente DATABASE_URL não está configurada!")
    print("Crie um arquivo .env na raiz do projeto com:")
    print("DATABASE_URL=postgresql://usuario:senha@host:porta/nome_banco")
    exit(1)

print(f"Conectando ao banco: {DATABASE_URL[:30]}...")

# Importa a função de criação de tabelas
from api.models import create_tables

try:
    # Cria todas as tabelas
    create_tables()
    print("✓ Tabelas criadas com sucesso!")
    print("\nTabelas criadas:")
    print("  - projects")
    print("  - contacts")
    print("\nAgora você pode fazer o deploy na Vercel!")
except Exception as e:
    print(f"✗ Erro ao criar tabelas: {e}")
    exit(1)