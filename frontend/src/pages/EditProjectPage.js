import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// Recebe 'isAuthenticated'
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
  
  const { id } = useParams(); // Pega o ID da URL (ex: /edit-project/12)
  const navigate = useNavigate();

  // Efeito de segurança e busca de dados
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    // Se estiver autenticado, busca os dados do projeto
    axios.get(`/api/projects/${id}`)
      .then(response => {
        // Preenche o formulário com os dados do banco
        setFormData({
          name: response.data.name,
          description: response.data.description || '',
          area_saber: response.data.area_saber,
          materia: response.data.materia,
          image_url: response.data.image_url || '',
          project_link: response.data.project_link || '',
        });
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar o projeto!", error);
        setMessage('Erro ao carregar o projeto. Ele existe?');
        setIsLoading(false);
      });

  }, [isAuthenticated, navigate, id]);

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

    // Envia os dados para a rota PUT (Update)
    axios.put(`/api/projects/${id}`, formData)
      .then(response => {
        setMessage('Projeto atualizado com sucesso!');
        // Redireciona de volta para o painel admin após 2s
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      })
      .catch(error => {
        setMessage('Erro ao atualizar o projeto. Tente novamente.');
        console.error("Erro no PUT do projeto!", error);
      });
  };

  // Se não estiver logado, não renderiza
  if (!isAuthenticated) {
    return null;
  }
  
  // Mostra um loading enquanto busca os dados
  if (isLoading) {
    return <div className="container"><p>Carregando dados do projeto...</p></div>
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 className="page-title">Editar Trabalho (ID: {id})</h1>
      
      <Link to="/admin" className="back-to-admin">
        <FaArrowLeft /> Voltar ao Painel Admin
      </Link>

      <form onSubmit={handleSubmit} className="contact-form">
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