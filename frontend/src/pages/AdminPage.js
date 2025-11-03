import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { FaEye, FaEyeSlash, FaPlus, FaTrash, FaPencilAlt, FaSave } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Removido 'useNavigate' se não for usado aqui

function AdminPage({ isAuthenticated, onLogin, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // --- Estados do formulário de Login ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // --- Estados para o formulário de Credenciais ---
  const [credData, setCredData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [credMessage, setCredMessage] = useState('');
  const [credError, setCredError] = useState('');

  const fetchMessages = () => {
    api.get('/api/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar as mensagens!", error);
        if (error.response && error.response.status === 401) {
           setError('Sessão expirada. Faça login novamente.');
           if (onLogout) onLogout(); // Força o logout se o token for inválido
        }
      });
  };

  const fetchProjects = () => {
    api.get('/api/projects') 
      .then(response => {
        const flatProjects = Object.values(response.data).flat();
        flatProjects.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setProjects(flatProjects);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os projetos!", error);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
      fetchProjects();
    }
  }, [isAuthenticated]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    api.post('/api/login', { username, password })
      .then(response => {
        const token = response.data.token;
        onLogin(token);
        setUsername('');
        setPassword('');
      })
      .catch(error => {
        console.error('Erro de login:', error);
        setError('Usuário ou senha incorretos.');
      });
  };
  
  const handleResetVotes = () => {
    const hasVotes = projects.some(p => p.votes > 0);
    if (!hasVotes) {
      alert('Não há nenhum voto registrado para resetar.');
      return; 
    }

    if (window.confirm("Você tem CERTEZA que deseja resetar TODOS os votos? Esta ação não pode ser desfeita.")) {
      api.post('/api/admin/reset-votes')
        .then(() => {
          alert('Votos resetados com sucesso!');
          fetchProjects(); 
        })
        .catch(err => {
          alert('Ocorreu um erro ao resetar os votos.');
          console.error(err);
        });
    }
  };

  const handleResetMessages = () => {
    if (messages.length === 0) {
      alert('Não há nenhuma mensagem para apagar.');
      return; 
    }
    
    if (window.confirm("Você tem CERTEZA que deseja apagar TODAS as mensagens? Esta ação não pode ser desfeita.")) {
      api.post('/api/admin/reset-messages')
        .then(() => {
          alert('Mensagens apagadas com sucesso!');
          fetchMessages(); 
        })
        .catch(err => {
          alert('Ocorreu um erro ao apagar as mensagens.');
          console.error(err);
        });
    }
  };

  const handleDeleteProject = (projectId, projectName) => {
    if (window.confirm(`Você tem CERTEZA que deseja apagar o projeto "${projectName}" (ID: ${projectId})? Esta ação não pode ser desfeita.`)) {
      api.delete(`/api/projects/${projectId}`)
        .then(() => {
          alert('Projeto apagado com sucesso!');
          fetchProjects();
        })
        .catch(err => {
          alert('Ocorreu um erro ao apagar o projeto.');
          console.error(err);
        });
    }
  };

  const handleCredChange = (e) => {
    const { name, value } = e.target;
    setCredData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setCredMessage('');
    setCredError('');

    if (!credData.currentPassword) {
      setCredError('A Senha Atual é obrigatória para salvar.');
      return;
    }
    
    if (!credData.newUsername && !credData.newPassword) {
      setCredError('Você deve fornecer um Novo Usuário ou uma Nova Senha.');
      return;
    }

    const payload = {
      current_password: credData.currentPassword,
      new_username: credData.newUsername || null,
      new_password: credData.newPassword || null,
    };

    api.put('/api/admin/credentials', payload)
      .then(response => {
        alert(response.data.message); // Alerta de sucesso
        setCredData({ // Limpa o formulário
          currentPassword: '',
          newUsername: '',
          newPassword: '',
        });
        if (onLogout) onLogout(); // Força o logout
      })
      .catch(error => {
        console.error('Erro ao atualizar credenciais:', error.response);
        if (error.response && error.response.data.error) {
          setCredError(error.response.data.error);
        } else {
          setCredError('Erro desconhecido. Tente novamente.');
        }
      });
  };


  // --- PARTE DE LOGIN (Se não estiver autenticado) ---
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h2 className="page-title">Acesso Restrito</h2>
        <p>Por favor, insira o usuário e senha para acessar o painel.</p>
        <form onSubmit={handleLoginSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              autoFocus 
            />
          </div>
          
          <div className="form-group">
            <div className="password-input-wrapper">
            <label htmlFor="password">Senha</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <span 
                style={{ 
                  position: 'absolute', 
                  right: '14px', 
                  top: '55%', 
                  transform: 'translateY(-50%)', 
                  cursor: 'pointer', 
                  userSelect: 'none',
                  color: 'var(--text-secondary)'
                }} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
          </div>
          </div>
          <button type="submit">Entrar</button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>
    );
  }

  const hasMessages = messages.length > 0;
  const hasVotes = projects.some(p => p.votes > 0);
  const hasProjects = projects.length > 0;

  // --- PARTE AUTENTICADA (Painel Admin) ---
  return (
    <div className="container">
      <h1 className="page-title">Painel do Administrador</h1>

      <div className="admin-section">
        <h2>Adicionar Trabalho</h2>
        <p>Adicionar um novo projeto ao portfólio.</p>
        <div className="admin-actions">
          <Link to="/admin/add-project" className="add-button">
            <FaPlus /> Adicionar Novo Trabalho
          </Link>
        </div>
      </div>

      <div className="admin-section">
        <h2>Alterar Credenciais</h2>
        <p>Mude seu nome de usuário ou senha. Você será deslogado após a alteração.</p>
        <form onSubmit={handleCredentialsSubmit} className="admin-credentials-form">
<div className="form-group">
            <label htmlFor="currentPassword">Senha Atual *</label>
            <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={credData.currentPassword}
                onChange={handleCredChange}
                required
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
            <small>Necessária para confirmar qualquer alteração.</small>
          </div>
          
          <hr className="form-divider" />

          <div className="form-group">
            <label htmlFor="newUsername">Novo Nome de Usuário</label>
            <input 
              type="text"
              id="newUsername"
              name="newUsername"
              value={credData.newUsername}
              onChange={handleCredChange}
              placeholder="Deixe em branco para manter o atual"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showNewPassword ? 'text' : 'password'} 
                id="newPassword"
                name="newPassword"
                value={credData.newPassword}
                onChange={handleCredChange}
                placeholder="Deixe em branco para manter a atual"
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
          </div>
          
          <div className="admin-actions" style={{ justifyContent: 'flex-start' }}>
            <button type="submit" className="add-button">
              <FaSave /> Salvar Alterações
            </button>
          </div>
          
          {credError && <p className="form-message error">{credError}</p>}
          {credMessage && <p className="form-message success">{credMessage}</p>}
        </form>
      </div>

      <div className="admin-section">
        <h2>Gerenciar Trabalhos</h2>
        {!hasProjects ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhum projeto encontrado.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Área</th>
                <th>Matéria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td data-label="ID">{p.id}</td>
                  <td data-label="Nome">{p.name}</td>
                  <td data-label="Área">{p.area_saber}</td>
                  <td data-label="Matéria">{p.materia}</td>
                  <td data-label="Ações" className="admin-actions-cell">
                    <Link to={`/admin/edit-project/${p.id}`} className="edit-button-small">
                      <FaPencilAlt /> Editar
                    </Link>
                    <button 
                      className="danger-button-small"
                      onClick={() => handleDeleteProject(p.id, p.name)}
                    >
                      <FaTrash /> Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-section">
        <h2>Manutenção</h2>
        <p>Ações perigosas que afetam o banco de dados. Use com cuidado.</p>
        <div className="admin-actions">
          <button 
            onClick={handleResetVotes} 
            className="danger-button"
            disabled={!hasVotes}
            style={{ opacity: !hasVotes ? 0.5 : 1, cursor: !hasVotes ? 'not-allowed' : 'pointer' }}
          >
            Resetar Votos de Todos os Projetos
          </button>
          <button 
            onClick={handleResetMessages} 
            className="danger-button"
            disabled={!hasMessages}
            style={{ opacity: !hasMessages ? 0.5 : 1, cursor: !hasMessages ? 'not-allowed' : 'pointer' }}
          >
            Apagar Todas as Mensagens
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2>Resumo de Votos</h2>
        {!hasVotes ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhum voto registrado ainda.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Total de Votos</th>
              </tr>
            </thead>
            <tbody>
              {projects
                .filter(p => p.votes > 0)
                .sort((a, b) => b.votes - a.votes)
                .map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.votes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-section">
        <h2>Mensagens Recebidas</h2>
        {!hasMessages ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhuma mensagem recebida ainda.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td data-label="Data">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleString('pt-BR', {
                      timeZone: 'America/Sao_Paulo'
                    }) : 'Sem data'}
                  </td>
                  <td data-label="Nome">{msg.name}</td>
                  <td data-label="Email">{msg.email}</td>
                  <td data-label="Mensagem">{msg.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
