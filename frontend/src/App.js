import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// 1. As importações de componentes e páginas
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SobreMimPage from './pages/SobreMimPage';
import CurriculumPage from './pages/CurriculumPage';
import RankingPage from './pages/RankingPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import AddProjectPage from './pages/AddProjectPage';
import EditProjectPage from './pages/EditProjectPage'; // <-- ADICIONADO
import './App.css';

function App() {
  // 2. Definir o estado de autenticação aqui
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            {/* 3. Passar o estado para a HomePage */}
            <Route 
              path="/" 
              element={<HomePage isAuthenticated={isAuthenticated} />} 
            />
            
            <Route path="/sobremim" element={<SobreMimPage />} />
            <Route path="/curriculo" element={<CurriculumPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* 4. Passar o estado E a função de set para a AdminPage */}
            <Route 
              path="/admin" 
              element={<AdminPage 
                isAuthenticated={isAuthenticated} 
                setIsAuthenticated={setIsAuthenticated} 
              />} 
            />
            
            {/* 5. Adicionar a nova rota, passando o estado para protegê-la */}
            <Route 
              path="/admin/add-project" 
              element={<AddProjectPage isAuthenticated={isAuthenticated} />} 
            />
            
            {/* 6. NOVA ROTA DE EDIÇÃO (com :id dinâmico) */}
            <Route 
              path="/admin/edit-project/:id" 
              element={<EditProjectPage isAuthenticated={isAuthenticated} />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;