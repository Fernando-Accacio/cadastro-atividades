import React from 'react';
import axios from 'axios';

const materiaStyle = {
  fontWeight: 'bold',
  color: '#1abc9c',
  marginBottom: '10px',
  display: 'block'
};

function ProjectCard({ project, onVote }) {
  
  const handleVote = () => {
    axios.post(`/api/projects/${project.id}/vote`)
      .then(response => {
        onVote(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao votar!", error);
      });
  };

  return (
    <div className="project-card">
      
      {project.image_url ? (
        <img src={project.image_url} alt={project.name} />
      ) : (
        <div className="image-placeholder">
          <span>Acessar via link</span>
        </div>
      )}
      
      <div className="project-card-content">
        <h3>{project.name}</h3>
        <span style={materiaStyle}>{project.materia}</span>
        <p>{project.description}</p>
        <div className="project-card-footer">

          <button 
            className="vote-button" 
            onClick={handleVote} 
          >
            Votar ({project.votes})
          </button>
          
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