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

  // --- Estados de Manutenção ---
  const [maintMessage, setMaintMessage] = useState('');
  const [maintError, setMaintError] = useState('');

  // --- NOVO ESTADO PARA ZONA DE PERIGO ---
  const [deleteUserError, setDeleteUserError] = useState('');

  // --- NOVOS ESTADOS PARA REGISTRO ---
  const [adminExists, setAdminExists] = useState(null); // null = loading
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regMessage, setRegMessage] = useState('');

  // --- Estados para Hobbies ---
  const [hobbies, setHobbies] = useState([]);
  const [isHobbyLoading, setIsHobbyLoading] = useState(false);

  // --- Estados para General Info (Homepage) ---
  const [homeInfo, setHomeInfo] = useState({
    objective: '',
    main_name: '',
    profile_pic_url: '',
    informal_intro: ''
  });
  const [homeMessage, setHomeMessage] = useState('');
  const [homeError, setHomeError] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [introMessage, setIntroMessage] = useState('');
  const [introError, setIntroError] = useState('');
  
  // --- Funções de Fetch (sem alterações) ---
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
    
  const fetchHomeInfo = useCallback(() => {
    api.get('/api/general-info')
      .then(response => {
        const data = response.data;
        setHomeInfo({
          objective: data.objective || '',
          main_name: data.main_name || '',
          profile_pic_url: data.profile_pic_url || '',
          informal_intro: data.informal_intro || ''
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
        setMaintError("Não foi possível carregar os hobbies.");
        setIsHobbyLoading(false);
      });
  }, []);

  // --- useEffect Principal (só roda se logado) ---
  useEffect(() => {
    if (isAuthenticated) {
        
        // --- CORREÇÃO DA MENSAGEM PERSISTENTE ---
        // Limpa todas as mensagens de formulário ao carregar o painel
        setCredMessage('');
        setCredError('');
        setMaintMessage('');
        setMaintError('');
        setHomeMessage('');
        setHomeError('');
        setDeleteUserError('');
        setIntroMessage(''); // Limpa a msg da intro também
        setIntroError('');   // Limpa o erro da intro também
        // ----------------------------------------

        fetchMessages();
        fetchProjects();
        fetchHobbies();
        fetchHomeInfo(); 
    }
  }, [isAuthenticated, fetchMessages, fetchProjects, fetchHobbies, fetchHomeInfo]);

  // --- useEffect (checa se admin existe) ---
  useEffect(() => {
    if (!isAuthenticated && adminExists === null) {
        api.get('/api/admin/user-exists')
            .then(response => {
                setAdminExists(response.data.exists);
            })
            .catch(error => {
                console.error("Erro ao checar se admin existe:", error);
                setAdminExists(true); 
                setError('Não foi possível verificar o status do servidor.');
            });
    }
  }, [isAuthenticated, adminExists]);


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

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    setRegMessage('');

    if (!regUsername || !regPassword) {
        setRegError('Usuário e Senha são obrigatórios.');
        return;
    }
    if (regPassword !== regConfirm) {
        setRegError('As senhas não coincidem.');
        return;
    }

    api.post('/api/admin/create-first-user', {
        username: regUsername,
        password: regPassword
    })
    .then(response => {
        setRegMessage(response.data.message);
        setRegError('');
        setRegUsername('');
        setRegPassword('');
        setRegConfirm('');
        setAdminExists(null); 
    })
    .catch(error => {
        if (error.response && error.response.data.error) {
            setRegError(error.response.data.error);
        } else {
            setRegError('Erro ao criar usuário.');
        }
        console.error('Erro no registro:', error);
    });
  };

  // Limpa *todas* as mensagens de erro/sucesso
  const clearAllMessages = () => {
    setCredMessage(''); setCredError('');
    setHomeMessage(''); setHomeError('');
    setMaintMessage(''); setMaintError('');
    setDeleteUserError('');
    setIntroMessage(''); setIntroError('');
  }

  const handleResetVotes = () => {
    clearAllMessages();
    const hasVotes = projects.some(p => p.votes > 0);
    if (!hasVotes) {
      setMaintError('Não há nenhum voto registrado para resetar.'); 
      return;
    }
    if (window.confirm("CERTEZA?")) {
      api.post('/api/admin/reset-votes')
        .then(() => { setMaintMessage('Votos resetados!'); fetchProjects(); })
        .catch(err => { setMaintError('Erro ao resetar os votos.'); console.error(err); });
    }
  };

  const handleResetMessages = () => {
    clearAllMessages();
    if (messages.length === 0) {
      setMaintError('Não há nenhuma mensagem para apagar.'); 
      return;
    }
    if (window.confirm("CERTEZA?")) {
      api.post('/api/admin/reset-messages')
        .then(() => { setMaintMessage('Mensagens apagadas!'); fetchMessages(); })
        .catch(err => { setMaintError('Erro ao apagar as mensagens.'); console.error(err); });
    }
  };

  const handleDeleteProject = (projectId, projectName) => {
    clearAllMessages();
    if (window.confirm(`CERTEZA que quer apagar o projeto "${projectName}"?`)) {
      api.delete(`/api/projects/${projectId}`)
        .then(() => { setMaintMessage('Projeto apagado!'); fetchProjects(); })
        .catch(err => { setMaintError('Erro ao apagar o projeto.'); console.error(err); });
    }
  };

  const handleCredChange = (e) => {
    const { name, value } = e.target;
    setCredData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    clearAllMessages();

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

// ==========================================================
// --- FUNÇÃO handleHomeInfoSubmit ATUALIZADA ---
// ==========================================================
const handleHomeInfoSubmit = (e, formId = 'homepage') => { 
    e.preventDefault();
    clearAllMessages(); // Limpa todas as mensagens

    const formData = new FormData();
    formData.append('objective', homeInfo.objective);
    formData.append('main_name', homeInfo.main_name); 
    formData.append('informal_intro', homeInfo.informal_intro);

    if (profilePicFile) {
      formData.append('profile_pic_file', profilePicFile);
      formData.append('profile_pic_url', ''); 
    } else {
      formData.append('profile_pic_url', homeInfo.profile_pic_url || ''); 
    }

    api.put('/api/general-info', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      }
    })
    .then(response => {

      // --- LÓGICA DE MENSAGEM CORRIGIDA ---
      // Define a mensagem de sucesso baseado em qual formulário foi enviado
      if (formId === 'intro') {
          setIntroMessage('Introdução "Sobre Mim" atualizada com sucesso!');
      } else {
          setHomeMessage('Informações da Homepage e Foto de Perfil atualizadas!');
      }
      // --- FIM DA LÓGICA ---

      setHomeError('');
      setIntroError('');

      setHomeInfo({
        objective: response.data.objective,
        main_name: response.data.main_name,
        profile_pic_url: response.data.profile_pic_url,
        informal_intro: response.data.informal_intro
      });
      setProfilePicFile(null); 
    })
    .catch(error => {
      const errorMsg = error.response?.data?.error || 'Erro ao atualizar a Homepage.';

      // --- LÓGICA DE ERRO CORRIGIDA ---
      // Define a mensagem de erro baseado em qual formulário falhou
      if (formId === 'intro') {
          setIntroError(errorMsg);
      } else {
          setHomeError(errorMsg);
      }
      // --- FIM DA LÓGICA ---

      console.error("Erro ao atualizar Home Info:", error);
    });
};
// ==========================================================
// --- FIM DA ATUALIZAÇÃO ---
// ==========================================================

  // --- Handler de Deletar Hobby ---
  const handleHobbyDelete = (hobbyId, hobbyTitle) => {
    clearAllMessages();
    if (window.confirm(`Tem certeza que deseja apagar o hobby "${hobbyTitle}"?`)) {
      api.delete(`/api/hobbies/${hobbyId}`)
        .then(() => {
          setMaintMessage("Hobby apagado com sucesso.");
          fetchHobbies(); 
        })
        .catch(err => {
          const errorMsg = err.response?.data?.error || 'Erro ao apagar o hobby.';
          setMaintError(errorMsg); 
          console.error("Erro ao deletar hobby:", err);
        });
    }
  };

  // --- NOVO HANDLER PARA DELETAR USUÁRIO ---
  const handleDeleteUser = () => {
    clearAllMessages();
    if (window.confirm("Você tem CERTEZA que quer apagar sua conta de administrador?")) {
        if (window.confirm("ISSO É IRREVERSÍVEL. Todo o acesso será perdido até que um novo usuário seja criado. Confirmar?")) {
            api.delete('/api/admin/delete-user')
                .then(() => {
                    if (onLogout) onLogout();
                    setAdminExists(null); 
                })
                .catch(err => {
                    const errorMsg = err.response?.data?.error || 'Erro ao apagar o usuário.';
                    setDeleteUserError(errorMsg); 
                    console.error("Erro ao deletar usuário:", err);
                });
        }
    }
  };

  // --- RENDER ---

  // --- LÓGICA DE RENDER (Login/Registro) ---
  if (!isAuthenticated) {
    
    // 1. Ainda carregando o status
    if (adminExists === null) {
        return (
            <div className="container" style={{ textAlign: 'center', maxWidth: '400px' }}>
                <h2 className="page-title">Verificando Servidor...</h2>
                <p>Aguarde um momento...</p>
                {error && <p className="form-message error" style={{ marginTop: '10px' }}>{error}</p>}
            </div>
        );
    }

    // 2. Admin NÃO existe, mostrar formulário de REGISTRO
    if (adminExists === false) {
        return (
            <div className="container" style={{ textAlign: 'center', maxWidth: '400px' }}>
                <h2 className="page-title">Criar Administrador</h2>
                <p>Nenhum usuário encontrado. Crie o primeiro administrador do portfólio.</p>
                <form onSubmit={handleRegistrationSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="regUsername">Novo Usuário</label>
                        <input type="text" id="regUsername" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required autoFocus />
                    </div>
                    <div className="form-group">
                        <label htmlFor="regPassword">Nova Senha</label>
                        <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
                            <input type={showPassword ? 'text' : 'password'} id="regPassword" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="regConfirm">Confirmar Senha</label>
                        <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
                            <input type={showNewPassword ? 'text' : 'password'} id="regConfirm" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} required />
                            <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                            </span>
                        </div>
                    </div>
                    <button type="submit">Criar Usuário</button>
                    {regError && <p className="form-message error" style={{ marginTop: '10px' }}>{regError}</p>}
                    {regMessage && <p className="form-message success" style={{ marginTop: '10px' }}>{regMessage}</p>}
                </form>
            </div>
        );
    }

    // 3. Admin EXISTE, mostrar formulário de LOGIN
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

  // Constantes de verificação (sem alterações)
  const hasMessages = messages.length > 0;
  const hasVotes = projects.some(p => p.votes > 0);
  const hasProjects = projects.length > 0;
  const hasHobbies = hobbies.length > 0;

  // Painel de Admin (se estiver autenticado)
  return (
    <div className="container">
      <h1 className="page-title">Painel do Administrador</h1>
      
      {/* --- GERENCIAR HOMEPAGE (Sem alterações) --- */}
      <div className="admin-section">
        <h2>Gerenciar Homepage</h2>
        <p>Modifique o Nome Principal, a Descrição e a Foto de Perfil exibidas na página inicial.</p>
        
        {/* onSubmit chama a função sem ID (default 'homepage') */}
        <form onSubmit={handleHomeInfoSubmit} className="admin-credentials-form">
          {/* Nome Principal */}
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

          {/* Descrição Principal */}
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

          {/* Imagem de Perfil */}
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
          {/* Mensagens corretas */}
          {homeError && <p className="form-message error">{homeError}</p>}
          {homeMessage && <p className="form-message success">{homeMessage}</p>}
        </form>
      </div>

      <hr className="form-divider" />
      
      {/* --- LINK: GERENCIAR CURRÍCULO (Sem alterações) --- */}
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

      {/* --- ORDEM 1: GERENCIAR TRABALHOS (Sem alterações) --- */}
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

      {/* --- ORDEM 2: GERENCIAR HOBBIES (Sem alterações) --- */}
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

        <hr className="form-divider" />
        
        {/* onSubmit chama a função com id 'intro' */}
        <form onSubmit={(e) => handleHomeInfoSubmit(e, 'intro')}>
            <div className="form-group">
                <label htmlFor="informal_intro">Introdução "Sobre Mim"</label>
                <textarea 
                    id="informal_intro" 
                    name="informal_intro" 
                    rows="6" 
                    value={homeInfo.informal_intro} 
                    onChange={handleHomeInfoChange} 
                    placeholder="Seu texto de introdução informal..."
                    style={{resize: 'vertical'}}
                />
                <small>Este texto aparecerá no topo da página "Sobre Mim".</small>
            </div>
            
            <div className="admin-actions" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
                <button type="submit" className="add-button" style={{backgroundColor: '#0077cc', color: 'white'}}>
                    <FaSave /> Salvar Introdução "Sobre Mim"
                </button>
            </div>
            {/* Mensagens corretas */}
            {introError && <p className="form-message error">{introError}</p>}
            {introMessage && <p className="form-message success">{introMessage}</p>}
        </form>

      </div>

      {/* --- ORDEM 3: ALTERAR CREDENCIAIS (Sem alterações no JSX) --- */}
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
        
        {maintError && <p className="form-message error" style={{ marginTop: '15px' }}>{maintError}</p>}
        {maintMessage && <p className="form-message success" style={{ marginTop: '15px' }}>{maintMessage}</p>}
      </div>

      {/* --- ORDEM 5: RESUMO DE VOTOS (Sem alterações) --- */}
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

      {/* --- ORDEM 6: MENSAGENS RECEBIDAS (Sem alterações) --- */}
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

      {/* --- NOVA SEÇÃO: ZONA DE PERIGO --- */}
      <hr className="form-divider" />
      <div className="admin-section" style={{ borderColor: '#dc3545' }}>
          <h2 style={{ color: '#dc3545' }}>Zona de Perigo</h2>
          <p>Ação irreversível. Isso irá apagar sua conta de administrador e exigir um novo registro.</p>
          <div className="admin-actions">
              <button onClick={handleDeleteUser} className="danger-button">
                  <FaTrash /> Apagar Minha Conta de Administrador
              </button>
          </div>
          {deleteUserError && <p className="form-message error" style={{ marginTop: '15px' }}>{deleteUserError}</p>}
      </div>

    </div>
  );
}

export default AdminPage;