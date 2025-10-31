import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="app-header">
      <Link to="/" className="header-logo">
        <h1>Meu Portfólio</h1>
      </Link>
      
      <nav className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
        <NavLink to="/" onClick={toggleMenu}>Home</NavLink>
        <NavLink to="/sobremim" onClick={toggleMenu}>Sobre Mim</NavLink>
        <NavLink to="/curriculo" onClick={toggleMenu}>Currículo</NavLink>
        <NavLink to="/ranking" onClick={toggleMenu}>Ranking</NavLink>
        <NavLink to="/contact" onClick={toggleMenu}>Contato</NavLink>
        <NavLink to="/admin" onClick={toggleMenu}>Painel Admin</NavLink>
      </nav>

      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </div>
    </header>
  );
}

export default Header;