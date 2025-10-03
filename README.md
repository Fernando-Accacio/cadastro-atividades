# Portfólio de Trabalhos Acadêmicos

Este projeto é uma aplicação web full-stack desenvolvida para servir como um portfólio pessoal, apresentando trabalhos acadêmicos organizados por Áreas do Saber. A aplicação permite a visualização de projetos, um sistema de votação, e um formulário de contato, com uma área administrativa para visualização das mensagens recebidas.

## ✨ Funcionalidades

- **Visualização de Projetos:** Os trabalhos são exibidos e agrupados por "Áreas do Saber" (Linguagens, Ciências da Natureza, etc.).
- **Sistema de Votação:** Os visitantes podem votar nos projetos que mais gostaram.
- **Ranking:** Uma página dedicada exibe os projetos ordenados pelo número de votos.
- **Formulário de Contato:** Permite que os visitantes enviem mensagens, que são salvas no banco de dados.
- **Área Administrativa:** Uma página de "Mensagens", protegida por uma senha simples no frontend, para visualizar os contatos recebidos.
- **Gerenciamento de Dados:** Os trabalhos são facilmente gerenciados através de um script de inicialização no backend.
- **Comandos de Manutenção:** Scripts de linha de comando para resetar votos e mensagens de forma independente.

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: o frontend e o backend.

#### **Frontend**
- **[React](https://reactjs.org/):** Biblioteca JavaScript para a construção da interface de usuário.
- **[Axios](https://axios-http.com/):** Cliente HTTP para fazer requisições à API do backend.
- **[React Router](https://reactrouter.com/):** Para gerenciamento de rotas e navegação entre as páginas.

#### **Backend**
- **[Python](https://www.python.org/):** Linguagem de programação para o servidor.
- **[Flask](https://flask.palletsprojects.com/):** Micro-framework para a criação da API.
- **[Flask-CORS](https://flask-cors.readthedocs.io/):** Extensão para lidar com Cross-Origin Resource Sharing (CORS).

#### **Banco de Dados**
- **[SQLite 3](https://www.sqlite.org/index.html):** Banco de dados relacional leve e baseado em arquivo, ideal para desenvolvimento local.

---

## 🚀 Instalação e Execução Local

Para rodar este projeto na sua máquina, siga os passos abaixo.

### Pré-requisitos

Antes de começar, garanta que você tem os seguintes softwares instalados:
- **[Node.js](https://nodejs.org/) (versão 18 ou superior):** Inclui o `npm`, o gerenciador de pacotes do Node.
- **[Python](https://www.python.org/) (versão 3.8 ou superior):** Durante a instalação no Windows, marque a opção "Add Python to PATH".

### Passo a Passo

#### 1. Configurando o Backend (Python/Flask)

Abra um terminal e siga os comandos:

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Crie um ambiente virtual
python -m venv venv

# 3. Ative o ambiente virtual
# No Windows (PowerShell/CMD):
.\venv\Scripts\activate
# No macOS/Linux:
# source venv/bin/activate

# 4. Instale as dependências do Python
pip install -r requirements.txt

# 5. Defina a aplicação Flask a ser executada
# No Windows (PowerShell):
$env:FLASK_APP="backend"
# No Windows (CMD):
# set FLASK_APP=backend
# No macOS/Linux:
# export FLASK_APP=backend

# 6. Crie o banco de dados pela primeira vez
flask init-db
````

#### 2\. Configurando o Frontend (React)

Abra um **novo terminal** e siga os comandos:

```bash
# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências do Node.js
npm install
```

### Executando a Aplicação

Com as dependências instaladas, você precisará de dois terminais abertos para rodar o projeto.

**No Terminal 1 (Backend):**

```bash
# Navegue até a pasta 'backend' e ative o venv se ainda não estiver ativo
flask run
```

*O servidor do backend estará rodando em `http://127.0.0.1:5000`.*

**No Terminal 2 (Frontend):**

```bash
# Navegue até a pasta 'frontend'
npm start
```

*A aplicação React será aberta automaticamente no seu navegador em `http://localhost:3000`.*

-----

## ⚙️ Scripts de Manutenção (Backend)

Foram criados alguns comandos úteis para gerenciar o banco de dados. Eles devem ser executados no terminal do backend com o ambiente virtual ativado.

  - **`flask init-db`**

      - **Ação:** Comando destrutivo. Apaga **TUDO** (projetos e mensagens) e recria o banco de dados do zero com os trabalhos de exemplo definidos em `database.py`.

  - **`flask reset-votes`**

      - **Ação:** Zera a contagem de votos de todos os projetos para 0. Não afeta as mensagens.

  - **`flask reset-messages`**

      - **Ação:** Apaga todas as mensagens de contato. Não afeta os projetos ou os votos.

## 📁 Estrutura do Projeto

```
meu-portfolio/
├── backend/
│   ├── api/
│   ├── venv/
│   ├── __init__.py      # Fábrica da aplicação Flask
│   ├── database.py    # Lógica do banco de dados e comandos CLI
│   ├── routes.py      # Definição das rotas da API
│   ├── requirements.txt # Dependências do Python
│   └── portfolio.db     # Arquivo do banco de dados SQLite
│
└── frontend/
    ├── public/
    │   ├── images/      # Imagens estáticas dos projetos
    │   └── index.html   # Template HTML principal
    └── src/
        ├── components/  # Componentes reutilizáveis (Header, Card, etc.)
        ├── pages/       # Componentes de página (HomePage, RankingPage, etc.)
        ├── App.js       # Roteador principal da aplicação
        └── index.js     # Ponto de entrada da aplicação React
