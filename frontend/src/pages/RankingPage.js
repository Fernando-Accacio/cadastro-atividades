import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

function HomePage() {
  const [projectsByArea, setProjectsByArea] = useState({});

  useEffect(() => {
    axios.get('/api/projects')
      .then(response => {
        
        // Pega o objeto de resposta (ex: { "IoT": [...], "Web": [...] })
        const data = response.data;
        
        // Cria um novo objeto para guardar os dados ordenados
        const sortedData = {};

        // Itera sobre cada chave (cada "área") no objeto
        for (const area in data) {
          // Pega o array de projetos para a área atual
          const projects = data[area];

          // Verifica se 'projects' é realmente um array antes de ordenar
          if (Array.isArray(projects)) {
            
            // --- ESTA É A LÓGICA CORRETA ---
            // Ordena o array de projetos pelo ID, em ordem crescente.
            // (a.id - b.id) = crescente (mais antigo primeiro)
            const sortedProjects = projects.sort((a, b) => a.id - b.id);
            // --- FIM DA LÓGICA ---

            // Adiciona o array ordenado ao nosso novo objeto
            sortedData[area] = sortedProjects;
          }
        }

        // Define o estado com o objeto contendo os arrays ordenados
        setProjectsByArea(sortedData);
        
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os projetos!", error);
      });
  }, []); // Array de dependências vazio, roda só uma vez

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
        {Object.keys(projectsByArea).map(area => (
          <div key={area} style={{ marginBottom: '70px' }}>
            <h3 style={{ fontSize: '22px', color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
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