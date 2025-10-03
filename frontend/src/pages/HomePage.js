import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

function HomePage() {
  const [projectsByArea, setProjectsByArea] = useState({});

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/projects')
      .then(response => {
        setProjectsByArea(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os projetos!", error);
      });
  }, []);

  const handleVoteUpdate = (updatedProject) => {
    const { area_saber } = updatedProject;
    setProjectsByArea(currentAreas => ({
      ...currentAreas,
      [area_saber]: currentAreas[area_saber].map(p => 
        p.id === updatedProject.id ? updatedProject : p
      )
    }));
  };

  return (
    <div className="container">
      <section className="about-section">
        <img src="/images/marcelo.JPG" alt="Foto do Aluno" />
        <h2>Marcelo Antony Accacio Olhier</h2>
        <p>Sou Marcelo, tenho 18 anos, estudante de tecnologia com foco em IOT.</p>
      </section>

      <section id="projects">
        <h2 className="page-title">Meus Trabalhos - Por áreas do saber</h2>
        {Object.keys(projectsByArea).map(area => (
          <div key={area} style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
              {area}
            </h3>
            <div className="project-grid">
              {projectsByArea[area].map(project => (
                <ProjectCard key={project.id} project={project} onVote={handleVoteUpdate} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HomePage;