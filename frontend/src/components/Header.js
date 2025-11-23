import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import api from '../api/axiosConfig';

function Header({ isAuthenticated, onLogout }) {
  const [menuActive, setMenuActive] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // NOVO: Estado para controlar o Modal de Logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  
  const userName = localStorage.getItem('admin_username'); 

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/general-info')
        .then(response => {
          if (response.data && response.data.profile_pic_url) {
            setProfileImage(response.data.profile_pic_url);
          }
        })
        .catch(error => console.error("Erro ao carregar imagem do header:", error));
    }
  }, [isAuthenticated]);

  // 1. Função chamada ao clicar no botão "Sair" (Abre o Modal)
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setMenuActive(false); // Fecha o menu mobile se estiver aberto
  };

  // 2. Função que executa o logout de verdade (Chamada pelo Modal)
  const confirmLogout = () => {
    localStorage.removeItem('admin_username'); 
    onLogout();
    setShowLogoutModal(false); // Fecha o modal
    navigate('/admin'); 
  };

  // 3. Fecha o modal sem sair
  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="app-header">
        <Link to="/" className="header-logo" onClick={() => setMenuActive(false)}>
          <img src="/logo.png" alt="Portfólio" className="logo-img" />
        </Link>
        
        <div className="hamburger" onClick={() => setMenuActive(!menuActive)}>
          &#9776;
        </div>

        <nav className={menuActive ? "nav-menu active" : "nav-menu"}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuActive(false)}>
            Home
          </NavLink>
          <NavLink to="/sobremim" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuActive(false)}>
            Sobre Mim
          </NavLink>
          <NavLink to="/curriculo" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuActive(false)}>
            Currículo
          </NavLink>
          <NavLink to="/ranking" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuActive(false)}>
            Ranking
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuActive(false)}>
            Contato
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuActive(false)}>
            Painel Admin
          </NavLink>

          {isAuthenticated && (
            <div className="user-controls">
              <div className="user-info">
                  {profileImage ? (
                    <img src={profileImage} alt="Perfil" className="header-profile-img" />
                  ) : (
                    <FaUserCircle className="header-default-icon" />
                  )}
                  <span className="user-name">Olá, {userName || 'Admin'}</span>
              </div>

              {/* O botão agora chama handleLogoutClick que abre o modal */}
              <button onClick={handleLogoutClick} className="logout-button">
                <FaSignOutAlt /> Sair
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* --- MODAL DE LOGOUT (Igual ao da Vending Machine) --- */}
      {showLogoutModal && (
        <div className="modal-backdrop">
          <div className="modal-content logout-modal-content">
            <div className="modal-header">
              <h3>Sair do Sistema</h3>
              <button className="close-btn" onClick={closeLogoutModal}>×</button>
            </div>
            <div className="modal-body">
              <p>Você tem certeza que deseja sair da sua conta?</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeLogoutModal}>Cancelar</button>
              <button className="btn-confirm-logout" onClick={confirmLogout}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;