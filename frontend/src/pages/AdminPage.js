import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { FaEye, FaEyeSlash, FaPlus, FaTrash, FaPencilAlt, FaSave, FaHeart, FaAddressCard, FaHome, FaFileUpload, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function AdminPage({ isAuthenticated, onLogin, onLogout }) {
  // --- Estados para Login, Mensagens, Projetos, Credenciais ---
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // Erro de login
  const [credData, setCredData] = useState({
    currentPassword: '', newUsername: '', newPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [credMessage, setCredMessage] = useState('');
  const [credError, setCredError] = useState('');

  // --- Estados para Hobbies ---
  const [hobbies, setHobbies] = useState([]);
  const [isHobbyLoading, setIsHobbyLoading] = useState(false);

  // --- NOVO/MODIFICADO: Estados para General Info (Homepage) ---
  const [homeInfo, setHomeInfo] = useState({
    objective: '',
    main_name: '', // NOVO: Nome principal na homepage
    profile_pic_url: '' // Para pré-visualização e fallback
  });
  const [homeMessage, setHomeMessage] = useState('');
  const [homeError, setHomeError] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  
  // --- Funções de Fetch ---
  const fetchMessages = useCallback(() => {
    api.get('/api/messages')
      .then(response => setMessages(response.data))
      .catch(error => {
        console.error("Houve um erro ao buscar as mensagens!", error);
        if (error.response && error.response.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
          if (onLogout) onLogout();
        }
      });
  }, [onLogout]);
    
  // --- Função de Fetch para General Info (Homepage) ---
  const fetchHomeInfo = useCallback(() => {
    api.get('/api/general-info')
      .then(response => {
        const data = response.data;
        setHomeInfo({
          objective: data.objective || '',
          main_name: data.main_name || '', // Carrega o novo campo
          profile_pic_url: data.profile_pic_url || ''
        });
      })
      .catch(error => console.error("Erro ao buscar General Info para Admin!", error));
  }, []);

  const fetchProjects = useCallback(() => {
    api.get('/api/projects') 
      .then(response => {
        const flatProjects = Object.values(response.data).flat();
        flatProjects.sort((a, b) => parseInt(a.id) - parseInt(b.id)); 
        setProjects(flatProjects);
      })
      .catch(error => console.error("Houve um erro ao buscar os projetos!", error));
  }, []);

  const fetchHobbies = useCallback(() => {
    setIsHobbyLoading(true);
    api.get('/api/hobbies')
      .then(response => {
        setHobbies(response.data);
        setIsHobbyLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar hobbies:", err);
        setCredError("Não foi possível carregar os hobbies.");
        setIsHobbyLoading(false);
      });
  }, []);

  // --- useEffect Principal ---
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
      fetchProjects();
      fetchHobbies();
      fetchHomeInfo(); 
    }
  }, [isAuthenticated, fetchMessages, fetchProjects, fetchHobbies, fetchHomeInfo]);

  // --- Handlers (Login, Resets, Credenciais) ---
  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    api.post('/api/login', { username, password })
      .then(response => {
        onLogin(response.data.token);
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
      setCredError('Não há nenhum voto registrado para resetar.'); 
      return;
    }
    if (window.confirm("CERTEZA?")) {
      api.post('/api/admin/reset-votes')
        .then(() => { setCredMessage('Votos resetados!'); fetchProjects(); })
        .catch(err => { setCredError('Erro ao resetar os votos.'); console.error(err); });
    }
  };

  const handleResetMessages = () => {
    if (messages.length === 0) {
      setCredError('Não há nenhuma mensagem para apagar.');
      return;
    }
    if (window.confirm("CERTEZA?")) {
      api.post('/api/admin/reset-messages')
        .then(() => { setCredMessage('Mensagens apagadas!'); fetchMessages(); })
        .catch(err => { setCredError('Erro ao apagar as mensagens.'); console.error(err); });
    }
  };

  const handleDeleteProject = (projectId, projectName) => {
    if (window.confirm(`CERTEZA que quer apagar o projeto "${projectName}"?`)) {
      api.delete(`/api/projects/${projectId}`)
        .then(() => { setCredMessage('Projeto apagado!'); fetchProjects(); })
        .catch(err => { setCredError('Erro ao apagar o projeto.'); console.error(err); });
    }
  };

  const handleCredChange = (e) => {
    const { name, value } = e.target;
    setCredData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setCredMessage(''); setCredError('');
    if (!credData.currentPassword) {
      setCredError('A Senha Atual é obrigatória.'); return;
    }
    if (!credData.newUsername && !credData.newPassword) {
      setCredError('Forneça um Novo Usuário ou Nova Senha.'); return;
    }
    const payload = {
      current_password: credData.currentPassword,
      new_username: credData.newUsername || null,
      new_password: credData.newPassword || null,
    };
    api.put('/api/admin/credentials', payload)
      .then(response => {
        setCredMessage(response.data.message + ' Você será deslogado.');
        setCredData({ currentPassword: '', newUsername: '', newPassword: '' });
        setTimeout(() => { if (onLogout) onLogout(); }, 3000);
      })
      .catch(error => {
        if (error.response && error.response.data.error) {
          setCredError(error.response.data.error);
        } else { setCredError('Erro desconhecido.'); }
      });
  };

  // --- Handlers para General Info (Homepage) ---
  const handleHomeInfoChange = (e) => {
    const { name, value } = e.target;
    setHomeInfo(prevData => ({ ...prevData, [name]: value }));
  };

  const handleProfilePicFileChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleHomeInfoSubmit = (e) => {
    e.preventDefault();
    setHomeMessage(''); setHomeError('');

    const formData = new FormData();
    formData.append('objective', homeInfo.objective);
    formData.append('main_name', homeInfo.main_name); // NOVO CAMPO
    
    // Lógica de arquivo/URL (Perfil Pic)
    if (profilePicFile) {
      formData.append('profile_pic_file', profilePicFile);
      formData.append('profile_pic_url', ''); // Limpa URL se arquivo for enviado
    } else {
      // Envia a URL do input para manter ou limpar (se o input foi limpo)
      formData.append('profile_pic_url', homeInfo.profile_pic_url || ''); 
    }
    
    // NOTA: Para um PUT completo, o ideal é enviar todos os campos necessários pelo backend.
    // Presumindo que o backend lida com os campos faltantes de contato/currículo
    // ou que eles não serão apagados ao usar FormData.

    api.put('/api/general-info', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      }
    })
    .then(response => {
      setHomeMessage('Informações da Homepage e Foto de Perfil atualizadas!');
      setHomeError('');
      // Atualiza o estado com as URLs e valores retornados do backend
      setHomeInfo({
        objective: response.data.objective,
        main_name: response.data.main_name, // ATUALIZA O NOVO CAMPO
        profile_pic_url: response.data.profile_pic_url
      });
      setProfilePicFile(null); // Limpa o arquivo selecionado
    })
    .catch(error => {
      const errorMsg = error.response?.data?.error || 'Erro ao atualizar a Homepage.';
      setHomeError(errorMsg);
      setHomeMessage('');
      console.error("Erro ao atualizar Home Info:", error);
    });
  };

  // --- Handler de Deletar Hobby ---
  const handleHobbyDelete = (hobbyId, hobbyTitle) => {
    if (window.confirm(`Tem certeza que deseja apagar o hobby "${hobbyTitle}"?`)) {
      api.delete(`/api/hobbies/${hobbyId}`)
        .then(() => {
          setCredMessage("Hobby apagado com sucesso."); // Reusa o state de mensagem
          fetchHobbies(); // Atualiza a lista
        })
        .catch(err => {
          const errorMsg = err.response?.data?.error || 'Erro ao apagar o hobby.';
          setCredError(errorMsg); // Reusa o state de erro
          console.error("Erro ao deletar hobby:", err);
        });
    }
  };

  // --- RENDER ---

  // Formulário de Login
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h2 className="page-title">Acesso Restrito</h2>
        <p>Por favor, insira o usuário e senha para acessar o painel.</p>
        <form onSubmit={handleLoginSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
              <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </span>
            </div>
          </div>
          <button type="submit">Entrar</button>
          {error && <p className="form-message error" style={{ marginTop: '10px' }}>{error}</p>}
        </form>
      </div>
    );
  }

  // Constantes de verificação
  const hasMessages = messages.length > 0;
  const hasVotes = projects.some(p => p.votes > 0);
  const hasProjects = projects.length > 0;
  const hasHobbies = hobbies.length > 0;

  // Painel de Admin
  return (
    <div className="container">
      <h1 className="page-title">Painel do Administrador</h1>
      
      {/* --- GERENCIAR HOMEPAGE (NOME, OBJETIVO E FOTO) --- */}
      <div className="admin-section">
        <h2>Gerenciar Homepage</h2>
        <p>Modifique o Nome Principal, a Descrição e a Foto de Perfil exibidas na página inicial.</p>
        
        <form onSubmit={handleHomeInfoSubmit} className="admin-credentials-form">
          {/* NOVO CAMPO: Nome Principal */}
          <div className="form-group">
            <label htmlFor="main_name">Nome Principal</label>
            <input 
              type="text" 
              id="main_name" 
              name="main_name" 
              value={homeInfo.main_name} 
              onChange={handleHomeInfoChange} 
              placeholder="Ex: Marcelo Antony Accacio Olhier"
              required
            />
            <small>Este é o nome principal exibido logo abaixo da foto na Homepage.</small>
          </div>
          <hr className="form-divider" />

          <div className="form-group">
            <label htmlFor="objective">Descrição Principal (Objetivo)</label>
            <textarea 
              id="objective" 
              name="objective" 
              rows="4" 
              value={homeInfo.objective} 
              onChange={handleHomeInfoChange} 
              placeholder="Sua descrição principal..."
              style={{resize: 'vertical'}}
            />
            <small>Este texto aparecerá na Home. O objetivo profissional do Currículo é editado no painel de Currículo.</small>
          </div>

          <hr className="form-divider" />

          <div className="form-group">
            <label htmlFor="profile_pic_url">URL da Imagem de Perfil (Atual)</label>
            <input 
              type="text" 
              id="profile_pic_url" 
              name="profile_pic_url" 
              value={homeInfo.profile_pic_url || ''} 
              onChange={handleHomeInfoChange} 
              placeholder="URL de imagem externa (Opcional)"
            />
            {(homeInfo.profile_pic_url || profilePicFile) && (
              <div style={{marginTop: '10px', textAlign: 'center'}}>
              <img 
                src={profilePicFile ? URL.createObjectURL(profilePicFile) : homeInfo.profile_pic_url}
                alt="Pré-visualização"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
                <small style={{display: 'block', marginTop: '5px'}}>
                  {profilePicFile ? 'Pré-visualização do arquivo a ser enviado' : 'Pré-visualização da Imagem Atual'}
                </small>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="profile_pic_file"><FaFileUpload /> Ou Carregue uma Nova Imagem (Substituirá a URL)</label>
            <input 
              type="file" 
              id="profile_pic_file" 
              name="profile_pic_file" 
              onChange={handleProfilePicFileChange} 
              accept="image/*"
            />
          </div>
          
          <div className="admin-actions" style={{ justifyContent: 'flex-start' }}>
            <button type="submit" className="add-button" style={{backgroundColor: '#ff5722', color: 'white'}}>
              <FaSave /> Salvar Homepage
            </button>
          </div>
          {homeError && <p className="form-message error">{homeError}</p>}
          {homeMessage && <p className="form-message success">{homeMessage}</p>}
        </form>
      </div>

      <hr className="form-divider" />
      
      {/* --- LINK: GERENCIAR CURRÍCULO --- */}
      <div className="admin-section">
        <h2>Áreas de Conteúdo</h2>
        <p>Acesse o painel dedicado para gerenciar os dados do seu currículo.</p>
        <div className="admin-actions">
          <Link 
            to="/admin/curriculum" 
            className="add-button" 
            style={{backgroundColor: '#0077cc', color: 'white'}}
          >
            <FaAddressCard /> Gerenciar Currículo
          </Link>
        </div>
      </div>

      {/* --- ORDEM 1: GERENCIAR TRABALHOS --- */}
      <div className="admin-section">
        <h2>Gerenciar Trabalhos</h2>
        <p>Adicionar um novo projeto ao portfólio ou editar/deletar projetos existentes.</p>
        <div className="admin-actions">
          <Link to="/admin/add-project" className="add-button">
            <FaPlus /> Adicionar Novo Trabalho
          </Link>
        </div>

        <hr className="form-divider" />
        
        <h3>Trabalhos Atuais</h3>
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
                    <button className="danger-button-small" onClick={() => handleDeleteProject(p.id, p.name)}>
                      <FaTrash /> Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- ORDEM 2: GERENCIAR HOBBIES --- */}
      <div className="admin-section">
        <h2>Gerenciar Hobbies</h2>
        <p>Adicionar, editar ou remover hobbies da página "Sobre Mim".</p>
        
        <div className="admin-actions">
          <Link 
            to="/admin/add-hobby" 
            className="add-button" 
            style={{backgroundColor: '#0077cc', color: 'white'}}
          >
            <FaPlus /> Adicionar Novo Hobby
          </Link>
        </div>

        <hr className="form-divider" />

        {/* Tabela de Hobbies Atuais */}
        <h3>Hobbies Atuais</h3>
        {isHobbyLoading && !hasHobbies ? (
          <p>Carregando hobbies...</p>
        ) : !hasHobbies ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhum hobby cadastrado.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagem</th>
                <th>Título</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {hobbies.map(hobby => (
                <tr key={hobby.id}>
                  <td data-label="ID">{hobby.id}</td>
                  <td data-label="Imagem">
                    {hobby.image_url ? (
                      <img src={hobby.image_url} alt={hobby.title} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <span style={{color: '#999'}}>Sem Imagem</span>
                    )}
                  </td>
                  <td data-label="Título">{hobby.title}</td>
                  <td data-label="Ações" className="admin-actions-cell">
                    <Link 
                      to={`/admin/edit-hobby/${hobby.id}`} 
                      className="edit-button-small"
                    >
                      <FaPencilAlt /> Editar
                    </Link>
                    <button
                      className="danger-button-small"
                      onClick={() => handleHobbyDelete(hobby.id, hobby.title)}
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

      {/* --- ORDEM 3: ALTERAR CREDENCIAIS --- */}
      <div className="admin-section">
        <h2>Alterar Credenciais</h2>
        <p>Mude seu nome de usuário ou senha. Você será deslogado após a alteração.</p>
        <form onSubmit={handleCredentialsSubmit} className="admin-credentials-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Senha Atual *</label>
            <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
              <input type={showCurrentPassword ? 'text' : 'password'} id="currentPassword" name="currentPassword" value={credData.currentPassword} onChange={handleCredChange} required />
              <span className="password-toggle-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                {showCurrentPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </span>
            </div>
            <small>Necessária para confirmar qualquer alteração.</small>
          </div>
          <hr className="form-divider" />
          <div className="form-group">
            <label htmlFor="newUsername">Novo Nome de Usuário</label>
            <input type="text" id="newUsername" name="newUsername" value={credData.newUsername} onChange={handleCredChange} placeholder="Opcional" />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
              <input type={showNewPassword ? 'text' : 'password'} id="newPassword" name="newPassword" value={credData.newPassword} onChange={handleCredChange} placeholder="Opcional" />
              <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
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

      {/* --- ORDEM 4: MANUTENÇÃO (Reset) --- */}
      <div className="admin-section">
        <h2>Manutenção</h2>
        <p>Ações perigosas que afetam o banco de dados. Use com cuidado.</p>
        <div className="admin-actions">
          <button onClick={handleResetVotes} className="danger-button" disabled={!hasVotes}>
            Resetar Votos de Todos os Projetos
          </button>
          <button onClick={handleResetMessages} className="danger-button" disabled={!hasMessages}>
            Apagar Todas as Mensagens
          </button>
        </div>
      </div>

      {/* --- ORDEM 5: RESUMO DE VOTOS --- */}
      <div className="admin-section">
        <h2>Resumo de Votos</h2>
        {!hasVotes ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhum voto registrado.</p>
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
                .map((p, index) => (
                  <tr key={p.id} className={ index === 0 ? "top-rank-1" : index === 1 ? "top-rank-2" : index === 2 ? "top-rank-3" : "" }>
                    <td data-label="Projeto">{p.name}</td>
                    <td data-label="Total de Votos">{p.votes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- ORDEM 6: MENSAGENS RECEBIDAS --- */}
      <div className="admin-section">
        <h2>Mensagens Recebidas</h2>
        {!hasMessages ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhuma mensagem recebida.</p>
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
                  <td data-label="Data">{msg.timestamp ? new Date(msg.timestamp).toLocaleString('pt-BR') : 'Sem data'}</td>
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