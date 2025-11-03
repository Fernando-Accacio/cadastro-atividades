import React from 'react';
// import axios from 'axios'; // Não precisamos mais do import direto
import api from '../api/axiosConfig'; // <-- 1. USAR O AXIOS CONFIG

function ProjectCard({ project, onVote }) {
  
  const handleVote = () => {
    // 2. Usar a instância 'api'
    api.post(`/api/projects/${project.id}/vote`)
      .then(response => {
        onVote(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao votar!", error);
      });
  };

  // Função para pegar as iniciais do nome
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="project-card">
      
      {/* ======================================== */}
      {/* === 3. LÓGICA DA IMAGEM CORRIGIDA ==== */}
      {/* ======================================== */}
      {project.image_url ? (
        // Se TEM imagem, mostra a <img>
        <img 
          src={project.image_url} 
          alt={project.name} 
          className="project-card-image" // Classe para estilizar
        />
      ) : (
        // Se NÃO TEM imagem, mostra um placeholder com as iniciais
        <div className="image-placeholder">
          <span>{getInitials(project.name)}</span>
        </div>
      )}
      {/* ======================================== */}
      
      <div className="project-card-content">
        <h3>{project.name}</h3>
        <span className="project-card-materia">{project.materia}</span>
        <p>{project.description}</p>
        <div className="project-card-footer">

          <button 
            className="vote-button" 
            onClick={handleVote} 
          >
            Votar ({project.votes})
          </button>
          
          {/* O "Ver Projeto" (project_link) já estava correto aqui */}
          {project.project_link && (
            <a href={project.project_link} target="_blank" rel="noopener noreferrer">
              Ver Projeto
            </a>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
