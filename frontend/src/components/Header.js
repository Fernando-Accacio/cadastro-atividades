import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <h1>Meu Portfólio</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/curriculo">Currículo</Link>
        <Link to="/ranking">Ranking</Link>
        <Link to="/contact">Contato</Link>
        <Link to="/admin">Painel Admin</Link>
      </nav>
    </header>
  );
}
export default Header;