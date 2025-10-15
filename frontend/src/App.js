import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SobreMimPage from './pages/SobreMimPage';
import CurriculumPage from './pages/CurriculumPage';
import RankingPage from './pages/RankingPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobremim" element={<SobreMimPage />} />
            <Route path="/curriculo" element={<CurriculumPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;