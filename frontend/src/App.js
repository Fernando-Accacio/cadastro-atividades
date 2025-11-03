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
import EditHobbyPage from './pages/EditHobbyPage'; // Da etapa anterior
import AddHobbyPage from './pages/AddHobbyPage'; // NOVO IMPORT

import './App.css';

// Componente helper para o Logout (sem mudanças)
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

  // useEffect de verificação de token (sem mudanças)
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_token');
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
        setToken(null);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  // handleLogin (sem mudanças)
  const handleLogin = (newToken) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  // handleLogout (sem mudanças)
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main>
          <Routes>
            {/* Rotas Públicas (sem mudanças) */}
            <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
            <Route path="/sobremim" element={<SobreMimPage />} />
            <Route path="/curriculo" element={<CurriculumPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Rota de Admin (sem mudanças) */}
            <Route 
              path="/admin" 
              element={<AdminPage 
                isAuthenticated={isAuthenticated} 
                onLogin={handleLogin} 
                onLogout={handleLogout}
              />} 
            />
            
            {/* Rotas Protegidas de Projetos (sem mudanças) */}
            <Route 
              path="/admin/add-project" 
              element={<AddProjectPage isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/admin/edit-project/:id" 
              element={<EditProjectPage isAuthenticated={isAuthenticated} />} 
            />
            
            {/* Rotas Protegidas de Hobbies */}
            <Route 
              path="/admin/edit-hobby/:id" 
              element={<EditHobbyPage isAuthenticated={isAuthenticated} />} 
            />
            {/* ================================== */}
            {/* === NOVA ROTA PARA ADICIONAR === */}
            {/* ================================== */}
            <Route 
              path="/admin/add-hobby" 
              element={<AddHobbyPage isAuthenticated={isAuthenticated} />} 
            />
            
            {/* Rota de Logout (sem mudanças) */}
            <Route path="/logout" element={<LogoutHandler handleLogout={handleLogout} />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;