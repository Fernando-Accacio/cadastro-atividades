import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

function HomePage() {
  const [projectsByArea, setProjectsByArea] = useState({});

  // 1. ORDENAÇÃO DENTRO DAS ÁREAS (roda 1 vez quando o componente carrega)
  useEffect(() => {
    axios.get('/api/projects')
      .then(response => {
        
        const data = response.data;
        const sortedData = {};

        for (const area in data) {
          const projects = data[area];
          
          if (Array.isArray(projects)) {
            // Ordena os projetos dentro da área por ID (crescente)
            // ex: [Projeto 1, Projeto 2, Projeto 3]
            const sortedProjects = projects.sort((a, b) => a.id - b.id);
            sortedData[area] = sortedProjects;
          }
        }
        
        setProjectsByArea(sortedData);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os projetos!", error);
      });
  }, []); 

  // Função para atualizar o estado quando um voto é computado
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
        <img src="/images/marcelo-foto.jpg" alt="Foto do Aluno" />
        <h2>Marcelo Antony Accacio Olhier</h2>

        <p>
          Sou Marcelo, tenho 18 anos, e estudo Internet das Coisas (IoT) no Senac Nações Unidas. Tenho um grande interesse por tecnologia, inovação e segurança digital, e busco minha primeira oportunidade profissional para aplicar meus conhecimentos e evoluir na área. Sou curioso, dedicado e colaborativo, sempre em busca de aprender mais e entregar o meu melhor em cada desafio. 
          {' '}
          Venha conhecer um pouco mais{' '}
          <Link to="/sobremim" className="link-effect">
            sobre mim!
          </Link>
        </p>

        <div className="social-links">
          <a href="https://www.linkedin.com/in/marcelo-antony-741296363/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={24} />
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/marceloaccacio9-netizen" target="_blank" rel="noopener noreferrer">
            <FaGithub size={24} />
            <span>GitHub</span>
          </a>
          <a href="mailto:marceloaccacio9@gmail.com">
            <FaEnvelope size={24} />
            <span>Email</span>
          </a>
        </div>
      </section>

      <section id="projects">
        <h2 className="page-title">Meus Trabalhos</h2>
        
        {/* 2. ORDENAÇÃO DAS PRÓPRIAS ÁREAS (roda a cada renderização) */}
        {Object.keys(projectsByArea)
          .sort((areaA, areaB) => {
            // Pega os arrays de projetos (já ordenados pelo useEffect)
            const projectsA = projectsByArea[areaA];
            const projectsB = projectsByArea[areaB];

            // Pega o ID do projeto MAIS ANTIGO de cada área (o primeiro item)
            // (Usamos '|| {id: Infinity}' como segurança caso a área esteja vazia)
            const oldestIdA = (projectsA[0] || {id: Infinity}).id;
            const oldestIdB = (projectsB[0] || {id: Infinity}).id;

            // Compara os IDs mais antigos. A área com o ID menor vem primeiro.
            return oldestIdA - oldestIdB;
          })
          .map(area => (
            // Renderiza as áreas na ordem correta
            <div key={area} style={{ marginBottom: '70px' }}>
              <h3 style={{ fontSize: '22px', color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
                {area}
              </h3>
              <div className="project-grid">
                {/* Renderiza os projetos (que já estão em ordem [1, 2, 3...]) */}
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