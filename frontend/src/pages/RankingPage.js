import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

function HomePage() {
  const [projectsByArea, setProjectsByArea] = useState({});
  // --- MUDANÇA 1: Novo estado para guardar as chaves/áreas JÁ ORDENADAS ---
  const [sortedAreaKeys, setSortedAreaKeys] = useState([]);

  useEffect(() => {
    axios.get('/api/projects')
      .then(response => {
        
        const data = response.data;
        const sortedData = {};

        // Etapa A: Ordena os projetos DENTRO de cada área (como antes)
        for (const area in data) {
          const projects = data[area];
          if (Array.isArray(projects)) {
            const sortedProjects = projects.sort((a, b) => a.id - b.id);
            sortedData[area] = sortedProjects;
          }
        }
        
        // --- MUDANÇA 2: Ordenar as próprias ÁREAS aqui dentro ---
        
        // Pega as chaves (nomes das áreas)
        const keys = Object.keys(sortedData);

        // Ordena as chaves com base no ID mais antigo de cada área
        keys.sort((areaA, areaB) => {
          const projectsA = sortedData[areaA];
          const projectsB = sortedData[areaB];
          const oldestIdA = (projectsA[0] || {id: Infinity}).id;
          const oldestIdB = (projectsB[0] || {id: Infinity}).id;
          return oldestIdA - oldestIdB;
        });

        // --- MUDANÇA 3: Salvar AMBOS os estados ---
        setProjectsByArea(sortedData); // Salva os dados dos projetos
        setSortedAreaKeys(keys);       // Salva a ORDEM correta das áreas
        
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os projetos!", error);
      });
  }, []); 

  // Função de Voto (sem alteração)
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
      {/* ... seção 'about-section' (sem alteração) ... */}
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
        
        {/* --- MUDANÇA 4: Mapear o NOVO estado 'sortedAreaKeys' --- */}
        {/*
          Agora não usamos 'Object.keys' nem '.sort' aqui.
          Apenas mapeamos o array 'sortedAreaKeys' que JÁ ESTÁ na ordem certa.
        */}
        {sortedAreaKeys.map(area => (
            <div key={area} style={{ marginBottom: '70px' }}>
              <h3 style={{ fontSize: '22px', color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
                {area}
              </h3>
              <div className="project-grid">
                {/* O 'projectsByArea[area]' pega os projetos já ordenados pelo useEffect */}
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