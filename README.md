# 💼 Portfólio de Trabalhos Acadêmicos (Full-Stack)

Este projeto é uma aplicação **web completa** desenvolvida para servir como um **portfólio pessoal e interativo**.  
Ele apresenta **trabalhos acadêmicos**, um **currículo profissional**, **links para redes sociais** e um **painel de controle administrativo** para gerenciamento do site.

---

## ✨ Funcionalidades

- 🧑‍💻 **Apresentação Pessoal:** Página inicial com foto, biografia e links diretos para **LinkedIn, GitHub e E-mail**.  
- 📚 **Visualização de Projetos:** Trabalhos acadêmicos organizados por “Áreas do Saber”, com suporte para projetos com imagem, link externo, ambos ou nenhum.  
- 📄 **Página de Currículo:** Exibe o currículo completo e oferece **botão para download em PDF**.  
- ⭐ **Sistema de Votação e Ranking:** Visitantes podem votar nos projetos, e uma página de ranking exibe os mais votados.  
- 💬 **Formulário de Contato:** Permite o envio direto de mensagens.  
- 🔐 **Painel de Administrador:** Área protegida por senha com:
  - Visualização de todas as mensagens recebidas (com data e hora local);
  - Ferramentas de manutenção com **botões para resetar votos ou apagar mensagens**, com confirmações de segurança.
  - **Nota de Segurança:** A autenticação deste painel é realizada no **frontend (client-side)**. É uma medida de simplicidade para ocultar a página de visitantes comuns, adequada para o escopo deste projeto, e não uma barreira de segurança robusta contra um usuário com conhecimento técnico.


---

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: **frontend** e **backend**.

### 🖥️ Frontend
- ⚛️ [React](https://reactjs.org/) — Biblioteca JavaScript para interfaces de usuário.  
- 🌐 [Axios](https://axios-http.com/) — Cliente HTTP para requisições à API.  
- 🔀 [React Router](https://reactrouter.com/) — Gerenciamento de rotas e navegação.  
- 🧩 [React Icons](https://react-icons.github.io/react-icons/) — Inclusão de ícones (GitHub, LinkedIn, etc.).

### ⚙️ Backend
- 🐍 [Python](https://www.python.org/) — Linguagem utilizada no servidor.  
- 🔥 [Flask](https://flask.palletsprojects.com/) — Microframework para criação da API.  
- 🔄 [Flask-CORS](https://flask-cors.readthedocs.io/) — Gerenciamento de CORS.

### 💾 Banco de Dados
- 🗄️ [SQLite 3](https://www.sqlite.org/index.html) — Banco relacional leve e ideal para desenvolvimento local.

---

## 🚀 Instalação e Execução Local

### 🔧 Pré-requisitos

Antes de começar, garanta que você possui instalados:
- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[Python](https://www.python.org/)** (versão 3.8 ou superior)  
  > 💡 No Windows, marque “Add Python to PATH” durante a instalação.

---

### 1️⃣ Configurando o Backend (Python/Flask)

> **Observação:** Os comandos do backend devem ser executados a partir da **pasta raiz do projeto (`meu-portfolio/`)**.

Abra um terminal na pasta raiz e execute:

```powershell
# 1. Ative o ambiente virtual que está DENTRO da pasta backend
.\backend\venv\Scripts\activate

# 2. Instale as dependências do Python (se for a primeira vez)
pip install -r .\backend\requirements.txt

# 3. Defina a aplicação Flask a ser executada
$env:FLASK_APP="backend"

# 4. Crie o banco de dados pela primeira vez com o comando 'init-db'
flask init-db
````

---

### 2️⃣ Configurando o Frontend (React)

Abra um **novo terminal**, navegue até a pasta `frontend` e instale as dependências:

```bash
cd frontend
npm install
```

---

### ▶️ Executando a Aplicação

Com as dependências instaladas, você precisará de **dois terminais** abertos.

#### 🖥️ Terminal 1 (Backend)

```powershell
# Na pasta raiz (meu-portfolio), com o venv ativado e o FLASK_APP definido
flask run
```

> O servidor estará rodando em `http://127.0.0.1:5000`

#### 🌍 Terminal 2 (Frontend)

```bash
# Na pasta 'frontend'
npm start
```

> A aplicação abrirá automaticamente em `http://localhost:3000`

---

## ⚙️ Gerenciamento do Site

Existem **duas formas** de gerenciar os dados do site:

---

### ✅ 1. Painel Admin (Método Recomendado)

A forma **principal e mais segura** de gerenciar o site é pela interface web.

1. Acesse a aba **"Painel Admin"** no menu principal.
2. Insira a senha de acesso.
3. No painel, é possível:

   * 📨 **Visualizar mensagens** de contato recebidas.
   * ⭐ **Resetar votos** de todos os projetos com um clique (com confirmação).
   * 🧹 **Apagar todas as mensagens** com um clique (com confirmação).

> 💡 Este é o método recomendado para uso diário, sem necessidade de comandos manuais.

---

### 🧠 2. Via Terminal (Para Setup e Desenvolvedores)

Os comandos no terminal ainda são úteis para **configuração inicial** e **tarefas de desenvolvimento**.

#### `flask init-db`

* **Função:** Cria ou recria o banco de dados do zero.
* **Uso:**

  * Setup inicial.
  * Aplicar alterações feitas em `backend/database.py`.
* **Ação:** Apaga **tudo** (projetos, votos e mensagens) e recria o banco com os dados padrão.

#### `flask reset-votes` e `flask reset-messages`

* **Função:** Comandos alternativos ao painel Admin.
* **Uso:** Desenvolvedores que preferem operar via terminal.

---

## 📁 Estrutura do Projeto

```
meu-portfolio/
├── backend/
│   ├── venv/
│   ├── __init__.py        # Fábrica da aplicação Flask
│   ├── database.py        # Lógica do banco de dados e comandos CLI
│   ├── routes.py          # Rotas da API
│   ├── requirements.txt
│   └── portfolio.db
│
└── frontend/
    ├── public/
    │   ├── documents/     # Arquivos para download (ex: curriculo.pdf)
    │   ├── images/        # Imagens dos projetos
    │   └── index.html
    └── src/
        ├── components/    # Componentes reutilizáveis (Header, Card, etc.)
        ├── pages/         # Páginas do site
        │   ├── HomePage.js
        │   ├── CurriculumPage.js
        │   ├── RankingPage.js
        │   ├── ContactPage.js
        │   └── AdminPage.js
        ├── App.js         # Roteador principal da aplicação
        └── index.js
```