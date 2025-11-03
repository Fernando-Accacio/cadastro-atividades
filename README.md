# 💼 Portfólio de Trabalhos Acadêmicos (Full-Stack)

Este projeto é uma aplicação web completa, responsiva e de pilha dividida (decoupled), servindo como um portfólio pessoal interativo. Ele apresenta trabalhos acadêmicos, um currículo profissional e um painel de controle administrativo seguro para gerenciamento de todo o conteúdo.

🌐 Site em Produção: [https://cadastro-atividades.vercel.app/]
⚙️ API em Produção: [https://cadastro-atividades.onrender.com/]

## ✨ Funcionalidades

### Públicas

🧑‍💻 Apresentação Pessoal: Página inicial com biografia e links diretos para LinkedIn, GitHub e E-mail.

📚 Visualização de Projetos: Trabalhos organizados por "Áreas do Saber", com cards interativos.

📄 Página de Currículo: Exibe o currículo e oferece um botão para download do PDF.

⭐ Sistema de Votação e Ranking: Visitantes podem votar nos projetos. Uma página de ranking exibe os mais votados, com destaque para o Top 3.

💬 Formulário de Contato: Permite o envio direto de mensagens para o administrador.

📱 Design Responsivo: A interface se adapta a celulares, tablets e desktops.

### Painel de Administrador Seguro

Área protegida por um sistema de autenticação real baseado em Token (JWT). Apenas o administrador pode acessar:

🔐 Login Seguro: Autenticação via API que retorna um JSON Web Token (JWT) salvo no localStorage.

➕ Adicionar Projetos: Formulário para criar novos trabalhos no portfólio.

✏️ Editar Projetos: Capacidade de alterar qualquer informação de um projeto existente.

🗑️ Deletar Projetos: Remover projetos do banco de dados.

📨 Visualização de Mensagens: Acesso a todas as mensagens enviadas pelo formulário de contato.

🔑 Alterar Credenciais: O administrador pode alterar seu próprio nome de usuário e senha de forma segura.

☢️ Zona de Perigo: Ferramentas para resetar todos os votos ou apagar todas as mensagens, com confirmação.

💡 Nota sobre Registro de Usuário: Você notará que o site possui uma tela de "Login" protegida, mas não uma tela de "Registro". Isso é intencional.

Este projeto foi desenhado como um portfólio de usuário único (single-user), onde apenas o proprietário (administrador) pode gerenciar o conteúdo. A conta de administrador não é criada publicamente; ela é criada de forma segura no lado do servidor (backend) através de um comando CLI (flask create-admin), garantindo que ninguém mais possa se registrar ou modificar o portfólio.

---

## 🏗️ Arquitetura de Produção

Este projeto utiliza uma arquitetura de pilha dividida (decoupled), onde o Frontend e o Backend são aplicações completamente separadas e hospedadas em plataformas otimizadas para suas respectivas tecnologias.

```
┌───────────────────┐           ┌───────────────────┐           ┌──────────────────┐
│     VERCEL        │           │     RENDER        │           │     NEON        │
│   (Frontend)      │           │   (Backend)       │           │   (Database)    │
│     React         │  ── API ──>│   Python / Flask │  ── SQL ──>│   PostgreSQL    │
│ (cadastro-...)    │   Calls   │   (gunicorn)      │   Calls   │   (Serverless)  │
└───────────────────┘           └───────────────────┘           └──────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

### 🖥️ Frontend

* Framework: React
* Roteamento: React Router
* Cliente HTTP: Axios (configurado com baseURL para produção e desenvolvimento)
* Ícones: React Icons
* Autenticação: Armazenamento de Token JWT em localStorage.
* Hospedagem: Vercel

### ⚙️ Backend

* Linguagem: Python
* Framework: Flask (para a API REST)
* Servidor WSGI: Gunicorn (para produção no Render)
* ORM: SQLAlchemy (para interagir com o banco de dados)
* Autenticação: PyJWT (para criar e verificar tokens)
* Database Driver: Psycopg2 (para conectar ao PostgreSQL)
* Variáveis de Ambiente: python-dotenv
* Hospedagem: Render

### 💾 Banco de Dados

* Serviço: Neon
* Tipo: PostgreSQL (Serverless)

---

## 💻 Desenvolvimento Local

Para rodar o projeto em sua máquina, você precisará de 2 terminais abertos. A aplicação local se conectará ao mesmo banco de dados Neon da nuvem.

### 🔧 Pré-requisitos

* Node.js (v18 ou superior)
* Python (v3.11 recomendado)
* Uma conta no Neon para o banco de dados.

---

### 📦 Instalação

#### Clone o Repositório

```bash
git clone https://github.com/Fernando-Accacio/cadastro-atividades.git
cd cadastro-atividades
```

---

### Configure as Variáveis de Ambiente (Backend)

Crie um arquivo `.env` na raiz do projeto (`cadastro-atividades/.env`). Adicione as chaves que você configurou no Render:

```
# Do seu banco de dados Neon
DATABASE_URL=postgresql://...

# Chave secreta para o Flask (pode ser qualquer string aleatória)
JWT_SECRET_KEY=sua_chave_secreta_aqui

# Senha padrão para o primeiro admin
ADMIN_PASSWORD=senha_forte_para_o_admin

# Diz ao Flask onde encontrar a aplicação
FLASK_APP=api
```

---

### Configure as Variáveis de Ambiente (Frontend)

Crie outro arquivo `.env` dentro da pasta `frontend` (`cadastro-atividades/frontend/.env`):

```
# Diz ao React para se conectar à sua API local
REACT_APP_API_URL=http://127.0.0.1:5000
```

---

## 🚀 Rodando o Projeto

### Terminal 1 - Backend (Flask)

```bash
py -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
flask init-db
flask create-admin seu-nome-de-usuario
flask run
```

✅ Backend rodando em: [http://127.0.0.1:5000]

---

### Terminal 2 - Frontend (React)

```bash
cd frontend
npm install
npm start
```

✅ Frontend abrindo em: [http://localhost:3000])

> O `axiosConfig.js` do frontend lerá automaticamente a variável do `frontend/.env` e se conectará ao seu backend local.

---

🚀 Rodando o Projeto (após a primeira configuração)

Se você já executou tudo uma vez (criou ambiente virtual, instalou dependências, inicializou o banco e criou o admin), a rotina diária é muito mais simples:

Terminal 1 - Backend (Flask)
# Ativar o ambiente virtual
cd cadastro-atividades
# Windows
.\venv\Scripts\activate
$env:FLASK_APP="api"
# source venv/bin/activate # Linux/Mac

# Rodar o backend
flask run


✅ Backend disponível em: http://127.0.0.1:5000

Terminal 2 - Frontend (React)
cd cadastro-atividades/frontend

# Rodar o frontend
npm start


✅ Frontend disponível em: http://localhost:3000

---

## 📁 Estrutura do Projeto

```
cadastro-atividades/
├── .env                # Variáveis de ambiente do Backend (local)
├── .gitignore
├── requirements.txt    # Dependências Python (para Render e local)
├── vercel.json         # Configuração de deploy do Frontend na Vercel
├── venv/               # Ambiente virtual Python
│
├── api/                # CÓDIGO DO BACKEND (PYTHON/FLASK)
│   ├── __init__.py     # Inicialização da aplicação Flask
│   ├── database.py     # Comandos (init-db, create-admin)
│   ├── models.py       # Modelos de dados (SQLAlchemy)
│   └── routes.py       # Todas as rotas da API (/api/...)
│
└── frontend/           # CÓDIGO DO FRONTEND (REACT)
    ├── .env            # Variáveis de ambiente do Frontend (local)
    ├── build/          # Build de produção (ignorado pelo Git)
    ├── node_modules/   # Dependências Node.js (ignorado pelo Git)
    ├── public/
    │   ├── documents/  # PDF do currículo
    │   ├── images/     # Imagens estáticas (logo, etc.)
    │   └── index.html
    │
    ├── src/
    │   ├── api/
    │   │   └── axiosConfig.js # Configuração central do Axios (lê .env)
    │   │
    │   ├── components/      # Componentes reutilizáveis (Header, Footer, Card)
    │   │
    │   ├── pages/           # Páginas principais do site
    │   │   ├── AdminPage.js
    │   │   ├── AddProjectPage.js
    │   │   ├── EditProjectPage.js
    │   │   ├── HomePage.js
    │   │   └── ...
    │   │
    │   ├── App.js           # Roteador principal (React Router)
    │   ├── App.css
    │   └── index.js
    │
    └── package.json