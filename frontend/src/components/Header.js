import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Ícones de hambúrguer e 'X'

function Header() {
  // Estado para controlar se o menu mobile está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para alternar o estado do menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="app-header">
      <Link to="/" className="header-logo">
        <h1>Meu Portfólio</h1>
      </Link>
      
      <nav className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/sobremim" onClick={toggleMenu}>Sobre Mim</Link>
        <Link to="/curriculo" onClick={toggleMenu}>Currículo</Link>
        <Link to="/ranking" onClick={toggleMenu}>Ranking</Link>
        <Link to="/contact" onClick={toggleMenu}>Contato</Link>
        <Link to="/admin" onClick={toggleMenu}>Painel Admin</Link>
      </nav>

      {/* Botão hambúrguer que só aparece no mobile */}
      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </div>
    </header>
  );
}

export default Header;