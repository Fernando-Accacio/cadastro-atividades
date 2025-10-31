# 💼 Portfólio de Trabalhos Acadêmicos (Full-Stack)

Este projeto é uma aplicação **web completa e responsiva** desenvolvida para servir como um **portfólio pessoal e interativo**.  
Ele apresenta **trabalhos acadêmicos**, um **currículo profissional**, uma página **"Sobre Mim"** com hobbies e interesses, **links para redes sociais** e um **painel de controle administrativo** para gerenciamento do site.

🌐 **[Acesse o site em produção](https://cadastro-atividades.vercel.app/)**

---

## ✨ Funcionalidades

- 🧑‍💻 **Apresentação Pessoal:**  
  Página inicial com foto, biografia e links diretos para **LinkedIn, GitHub e E-mail**.
- 😊 **Página Sobre Mim:**  
  Seção mais pessoal com hobbies e interesses, apresentados em um layout de cards com imagem e texto.
- 📚 **Visualização de Projetos:**  
  Trabalhos acadêmicos organizados por "Áreas do Saber", com suporte para projetos com imagem, link externo, ambos ou nenhum.
- 📄 **Página de Currículo:**  
  Exibe o currículo completo e oferece **botão para download em PDF**.
- ⭐ **Sistema de Votação e Ranking:**  
  Visitantes podem votar nos projetos, e uma página de ranking exibe os mais votados, com destaque para o Top 3.
- 💬 **Formulário de Contato:**  
  Permite o envio direto de mensagens.
- 📱 **Design Responsivo:**  
  A interface se adapta a diferentes tamanhos de tela, de celulares a desktops, incluindo menu "hambúrguer" e tabelas que se transformam em cards.
- 🔐 **Painel de Administrador:**  
  Área protegida por senha com:
  - Visualização de todas as mensagens recebidas (com data e hora local);
  - Ferramentas de manutenção com **botões para resetar votos ou apagar mensagens**, com confirmações de segurança.
  - **Nota de Segurança:**  
    A autenticação deste painel é realizada no **frontend (client-side)**. É uma medida de simplicidade para ocultar a página de visitantes comuns, adequada para o escopo deste projeto, e não uma barreira de segurança robusta.

---

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: **frontend** e **backend**.

### 🖥️ Frontend
- ⚛️ [React](https://reactjs.org/) — Biblioteca JavaScript para interfaces de usuário.
- 🌐 [Axios](https://axios-http.com/) — Cliente HTTP para requisições à API.
- 🔀 [React Router](https://reactrouter.com/) — Gerenciamento de rotas e navegação.
- 🧩 [React Icons](https://react-icons.github.io/react-icons/) — Inclusão de ícones (GitHub, LinkedIn, etc.).
- ☁️ **Hospedagem:** [Vercel](https://vercel.com/)

### ⚙️ Backend
- 🐍 [Python](https://www.python.org/) — Linguagem utilizada no servidor.
- 🔥 [Flask](https://flask.palletsprojects.com/) — Microframework para criação da API.
- 🔄 [Flask-CORS](https://flask-cors.readthedocs.io/) — Gerenciamento de CORS.
- ☁️ **Hospedagem:** [Vercel](https://vercel.com/)

### 💾 Banco de Dados
- 🗄️ [Neon PostgreSQL](https://neon.tech/) — Banco de dados PostgreSQL serverless gerenciado na nuvem.

---

## 🌐 Deploy e Produção

### ☁️ Aplicação em Produção
O projeto está **totalmente hospedado na nuvem**:

- **Frontend:** Hospedado no Vercel com deploy automático a partir do repositório Git
- **Backend:** API Flask hospedada no Vercel como serverless functions
- **Banco de Dados:** Neon PostgreSQL (serverless)

🔗 **URL de Produção:** https://cadastro-atividades.vercel.app/

### 🚀 Configuração do Deploy no Vercel

#### Configurações do Frontend
1. Conecte o repositório ao Vercel
2. Configure o diretório raiz como `frontend`
3. Build Command: `npm run build`
4. Output Directory: `build`

#### Configurações do Backend
1. Configure o diretório raiz como `api`
2. Adicione as variáveis de ambiente no dashboard do Vercel:
   - `DATABASE_URL` — String de conexão do Neon PostgreSQL

#### Banco de Dados
1. Crie um banco no [Neon](https://neon.tech/)
2. Copie a connection string
3. Adicione nas variáveis de ambiente do Vercel

---

## 💻 Desenvolvimento Local

**Sim, é possível rodar localmente!** O projeto pode ser executado em sua máquina conectando-se ao **mesmo banco de dados na nuvem** usado pela versão em produção.

### 🔧 Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Python](https://www.python.org/) (versão 3.8 ou superior)
  - **No Windows:** Marque "Add Python to PATH" durante a instalação

---

### 📦 Instalação

#### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/seu-usuario/cadastro-atividades.git
cd cadastro-atividades
````

#### 2️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` na **raiz do projeto** com:

```properties
DATABASE_URL=postgresql://usuario:senha@host/database?sslmode=require
```

> 💡 Obtenha a connection string no dashboard do [Neon](https://neon.tech/)

---

### 🚀 Rodando o Projeto

Você precisará de **2 terminais abertos** ao mesmo tempo.

#### Terminal 1 - Backend (Flask)

```powershell
# Na pasta raiz do projeto

# Criar ambiente virtual (apenas na primeira vez)
py -m venv venv

# Ativar o ambiente virtual
.\venv\Scripts\activate

# Instalar dependências (apenas na primeira vez)
pip install -r requirements.txt

# Configurar a aplicação Flask
$env:FLASK_APP="api"

# Rodar o backend
flask run
```

✅ Backend rodando em: [http://127.0.0.1:5000](http://127.0.0.1:5000)

#### Terminal 2 - Frontend (React)

```bash
# Navegar para a pasta frontend
cd frontend

# Instalar dependências (apenas na primeira vez)
npm install

# Rodar o frontend
npm start
```

✅ Frontend abrindo automaticamente em: [http://localhost:3000](http://localhost:3000)

---

### 🔄 Como Funciona?

```
┌─────────────────────┐
│  Frontend Local     │ → http://localhost:3000
│  (React)            │
└──────────┬──────────┘
           │ proxy configurado em package.json
           ▼
┌─────────────────────┐
│  Backend Local      │ → http://127.0.0.1:5000
│  (Flask API)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Banco de Dados     │ → Neon PostgreSQL (Nuvem)
│  (PostgreSQL)       │
└─────────────────────┘
```

**Vantagens:**

* ✅ Não precisa configurar banco de dados local
* ✅ Testa com dados reais da produção
* ✅ Alterações no código são testadas localmente antes do deploy
* ✅ Compartilha o mesmo banco entre dev local e produção

**⚠️ Atenção:** Como está usando o banco de produção, **tome cuidado** ao testar funcionalidades que modificam dados (votos, mensagens, etc.).

---

### 🔁 Para Rodar Novamente (Depois da Primeira Vez)

**Terminal 1 (Backend):**

```powershell
cd caminho/do/projeto
.\venv\Scripts\activate
$env:FLASK_APP="api"
flask run
```

**Terminal 2 (Frontend):**

```bash
cd caminho/do/projeto/frontend
npm start
```

---

## ⚙️ Gerenciamento do Site

### ✅ Painel Admin (Interface Web)

1. Acesse a aba **"Painel Admin"** no menu do site
2. Insira a senha de acesso
3. No painel, é possível:

   * 📨 **Visualizar mensagens** de contato recebidas
   * ⭐ **Resetar votos** de todos os projetos
   * 🧹 **Apagar todas as mensagens**

> 💡 Todas as ações são executadas com confirmação de segurança.

---

## 📁 Estrutura do Projeto

```
cadastro-atividades/
├── .env                     # Variáveis de ambiente (NÃO commitar!)
├── .gitignore               # Arquivos ignorados pelo Git
├── requirements.txt         # Dependências Python
├── venv/                    # Ambiente virtual Python (não sobe pro Git)
│
├── api/                     # Backend (Flask)
│   ├── __init__.py          # Inicialização da aplicação Flask
│   ├── database.py          # Configuração e lógica do banco de dados
│   ├── models.py            # Modelos de dados (SQLAlchemy)
│   └── routes.py            # Rotas da API
│
└── frontend/                # Frontend (React)
    ├── public/
    │   ├── documents/       # Arquivos para download (ex: curriculo.pdf)
    │   ├── images/          # Imagens dos projetos
    │   └── index.html
    │
    ├── src/
    │   ├── components/      # Componentes reutilizáveis
    │   │   ├── ContactForm.js
    │   │   ├── Footer.js
    │   │   ├── Header.js
    │   │   └── ProjectCard.js
    │   │
    │   ├── pages/           # Páginas do site
    │   │   ├── AdminPage.js
    │   │   ├── ContactPage.js
    │   │   ├── CurriculumPage.js
    │   │   ├── HomePage.js
    │   │   ├── RankingPage.js
    │   │   └── SobreMimPage.js
    │   │
    │   ├── App.js           # Roteador principal
    │   └── index.js         # Ponto de entrada
    │
    ├── package.json         # Dependências Node.js (com proxy configurado)
    └── node_modules/        # Dependências instaladas (não sobe pro Git)
```

---

## ❓ Problemas Comuns

* **"python não é reconhecido"** → Use `py` ao invés de `python` ou reinstale o Python marcando "Add to PATH".
* **"npm não é reconhecido"** → Reinstale o Node.js e reinicie o terminal.
* **"Erro de conexão com banco"** → Confira o `.env` e a conexão com a internet.
* **"Porta 3000 ou 5000 já em uso"** → Feche outros programas usando essas portas.
* **Projetos não aparecem no site local** → Confirme o `proxy` no `frontend/package.json` e que o backend está rodando.

---

## 🔒 Segurança

### Arquivo `.gitignore` configurado para proteger:

* ✅ `.env` (senhas do banco de dados)
* ✅ `venv/` (ambiente virtual Python)
* ✅ `node_modules/` (dependências Node.js)
* ✅ `__pycache__/` (arquivos temporários Python)

**⚠️ NUNCA commite o arquivo `.env` no Git!**

---

## 📝 Licença

Este projeto é de uso pessoal e acadêmico.