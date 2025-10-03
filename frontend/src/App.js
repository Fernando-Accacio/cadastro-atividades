import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import AdminMessages from './pages/AdminMessages';
// NOVO: Importa a nova página de contato
import ContactPage from './pages/ContactPage'; 

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ranking" element={<RankingPage />} />
            {/* NOVA ROTA ADICIONADA ABAIXO */}
            <Route path="/contact" element={<ContactPage />} /> 
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;