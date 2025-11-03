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
      <Link to="/" className="header-logo" onClick={() => setMenuActive(false)}>
        <h1>Meu Portfólio</h1>
      </Link>
      
      <div className="hamburger" onClick={() => setMenuActive(!menuActive)}>
        &#9776; {/* Ícone de Hambúrguer (pode ser substituído por um ícone de React) */}
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