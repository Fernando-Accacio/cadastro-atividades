import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function EditProjectPage({ isAuthenticated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    area_saber: '',
    materia: '',
    image_url: '',
    project_link: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    setIsLoading(true);
    api.get(`/api/projects/${id}`)
      .then(response => {
        const project = response.data;
        setFormData({
          name: project.name || '',
          description: project.description || '',
          area_saber: project.area_saber || '',
          materia: project.materia || '',
          image_url: project.image_url || '',
          project_link: project.project_link || '',
        });
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados do projeto!", error);
        setMessage('Erro ao carregar o projeto. Ele existe?');
        setIsLoading(false);
      });
  }, [id, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.name || !formData.area_saber || !formData.materia) {
      setMessage('Nome, Área de Saber e Matéria são obrigatórios.');
      return;
    }

    api.put(`/api/projects/${id}`, formData)
      .then(response => {
        setMessage('Projeto atualizado com sucesso!');
      })
      .catch(error => {
        setMessage('Erro ao atualizar o projeto. Tente novamente.');
        console.error("Erro no PUT do projeto!", error);
      });
  };

  if (!isAuthenticated) {
    return null;
  }
  
  if (isLoading) {
    return <div className="container"><h1 className="page-title">Carregando dados...</h1></div>;
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 className="page-title">Editar Trabalho (ID: {id})</h1>
      
      <Link to="/admin" className="back-to-admin">
        <FaArrowLeft /> Voltar ao Painel Admin
      </Link>

      <form onSubmit={handleSubmit} className="contact-form">
        
        {/* CORREÇÃO: Adicionando os 'onChange' */}
        <div className="form-group">
          <label htmlFor="name">Nome do Projeto *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="area_saber">Área de Saber *</label>
          <input type="text" id="area_saber" name="area_saber" value={formData.area_saber} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="materia">Matéria *</label>
          <input type="text" id="materia" name="materia" value={formData.materia} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="image_url">URL da Imagem</label>
          <input type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Ex: /images/meu-projeto.jpg ou https://..." />
        </div>

        <div className="form-group">
          <label htmlFor="project_link">Link do Projeto</label>
          <input type="text" id="project_link" name="project_link" value={formData.project_link} onChange={handleChange} placeholder="Ex: https://github.com/..." />
        </div>

        <button type="submit" className="add-button">Salvar Alterações</button>
        
        {message && <p style={{ textAlign: 'center', marginTop: '15px' }}>{message}</p>}
      </form>
    </div>
  );
}

export default EditProjectPage;