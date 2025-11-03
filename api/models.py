from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.sql import func
import os
# NOVOS IMPORTS para hash de senha
from werkzeug.security import generate_password_hash, check_password_hash

# Pega a URL do banco a partir das variáveis de ambiente
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("Variável de ambiente DATABASE_URL não definida!")

# Configuração base do SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Testa a conexão antes de cada uso
    pool_recycle=1800    # Recicla a conexão a cada 30 minutos (1800s)
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Definição das Tabelas (Models) ---

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    area_saber = Column(String, nullable=False)
    materia = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    project_link = Column(String, nullable=True)
    votes = Column(Integer, nullable=False, default=0)

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

# =========================================================
# === NOVA TABELA DE USUÁRIO (ADMIN) ======================
# =========================================================
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    
    def set_password(self, password):
        """Cria um hash seguro para a senha"""
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        """Verifica se a senha enviada bate com o hash salvo"""
        return check_password_hash(self.password_hash, password)

# Função para obter uma sessão do banco (será usada nas rotas)
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Função para criar as tabelas no banco (usada pelo init-db)
def create_tables():
    Base.metadata.create_all(bind=engine)