import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';

function AddEducationPage({ isAuthenticated }) {
  const [formData, setFormData] = useState({
    degree: '', institution: '', completion_date: '', details: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.degree || !formData.institution || !formData.completion_date) {
      setError('Formação, Instituição e data são obrigatórios.');
      return;
    }
    
    setIsLoading(true);

    api.post('/api/education', formData)
      .then(response => {
        setIsLoading(false);
        setMessage('Formação adicionada com sucesso!');
        setFormData({ degree: '', institution: '', completion_date: '', details: '' });
      })
      .catch(err => {
        setIsLoading(false);
        const errorMsg = err.response?.data?.error || 'Erro ao adicionar a formação.';
        setError(errorMsg);
        console.error("Erro no POST da formação!", err);
      });
  };
  
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 className="page-title">Adicionar Formação</h1>
      
      <Link to="/admin/curriculum" className="back-to-admin">
        <FaArrowLeft /> Voltar ao Gerenciamento do Currículo
      </Link>

      <form onSubmit={handleSubmit} className="contact-form">
        
        <div className="form-group">
          <label htmlFor="degree">Nome da Formação / Diploma *</label>
          <input type="text" id="degree" name="degree" value={formData.degree} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="institution">Instituição de Ensino *</label>
          <input type="text" id="institution" name="institution" value={formData.institution} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
            <label htmlFor="completion_date">Data de Conclusão (Ex: Dez/2025) *</label>
            <input type="text" id="completion_date" name="completion_date" value={formData.completion_date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="details">Detalhes / Destaques</label>
          <textarea 
            id="details" 
            name="details" 
            rows="4" 
            value={formData.details} 
            onChange={handleChange}
            placeholder="Ex: 5º lugar no projeto Empreenda Senac."
          ></textarea>
        </div>

        <button type="submit" className="add-button" disabled={isLoading} style={{backgroundColor: '#28a745'}}>
          {isLoading ? 'Enviando...' : <><FaPlus /> Adicionar Formação</>}
        </button>
        
        {message && <p className="form-message success" style={{ marginTop: '15px' }}>{message}</p>}
        {error && <p className="form-message error" style={{ marginTop: '15px' }}>{error}</p>}
      </form>
    </div>
  );
}

export default AddEducationPage;