import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SobreMimPage from './pages/SobreMimPage';
import CurriculumPage from './pages/CurriculumPage';
import RankingPage from './pages/RankingPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import AddProjectPage from './pages/AddProjectPage';
import EditProjectPage from './pages/EditProjectPage';

import './App.css';

// Componente helper para o Logout (necessário para usar o hook useNavigate)
function LogoutHandler({ handleLogout }) {
  const navigate = useNavigate();
  useEffect(() => {
    handleLogout();
    navigate('/'); // Redireciona para a Home após o logout
  }, [handleLogout, navigate]);
  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  // Verifica o token no localStorage quando o app carrega
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Verifica se o token não expirou
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          // Token expirado
          localStorage.removeItem('admin_token');
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Token inválido
        localStorage.removeItem('admin_token');
        setToken(null);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  // Função de Login: salva o token
  const handleLogin = (newToken) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  // Função de Logout: remove o token
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Passa o status de login e a função de logout para o Header */}
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main>
          <Routes>
            {/* Passa o status de login para a HomePage */}
            <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
            <Route path="/sobremim" element={<SobreMimPage />} />
            <Route path="/curriculo" element={<CurriculumPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Passa o status e a função de login para a AdminPage */}
            <Route 
              path="/admin" 
              element={<AdminPage 
                isAuthenticated={isAuthenticated} 
                onLogin={handleLogin} 
                onLogout={handleLogout}
              />} 
            />
            
            {/* Novas rotas protegidas */}
            <Route 
              path="/admin/add-project" 
              element={<AddProjectPage isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/admin/edit-project/:id" 
              element={<EditProjectPage isAuthenticated={isAuthenticated} />} 
            />
            
            {/* Rota de Logout */}
            <Route path="/logout" element={<LogoutHandler handleLogout={handleLogout} />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;