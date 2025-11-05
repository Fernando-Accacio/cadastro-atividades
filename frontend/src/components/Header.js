import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

function Header({ isAuthenticated, onLogout }) {
  const [menuActive, setMenuActive] = React.useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/admin'); // Redireciona para a home após o logout
  };

  return (
    <header className="app-header">
      {/* ALTERADO: Substitui <h1> por <img> para a logo */}
      <Link to="/" className="header-logo" onClick={() => setMenuActive(false)}>
        {/* Acessa a imagem na pasta public. Altere o 'src' se o nome do seu arquivo for diferente */}
        <img src="/logo.png" alt="Logo do Meu Portfólio" className="logo-img" />
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
          <button onClick={handleLogoutClick} className="logout-button">
            <FaSignOutAlt /> Sair
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;