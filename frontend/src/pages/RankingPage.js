import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

function HomePage() {
  const [projectsByArea, setProjectsByArea] = useState({});
  const [sortedAreaKeys, setSortedAreaKeys] = useState([]);

  // SUBSTITUA O SEU useEffect INTEIRO POR ESTE
  useEffect(() => {
    console.log("### INICIANDO BUSCA DE DADOS... ###"); // Log 1
    axios.get('/api/projects')
      .then(response => {
        
        console.log("### DADOS RECEBIDOS (BRUTOS):", response.data); // Log 2
        const data = response.data;
        const sortedData = {};

        // Etapa A: Ordena os projetos DENTRO de cada área
        for (const area in data) {
          const projects = data[area];
          if (Array.isArray(projects)) {
            // Usando parseInt para garantir a comparação numérica
            const sortedProjects = projects.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            sortedData[area] = sortedProjects;
          }
        }
        console.log("### ETAPA A - DADOS COM PROJETOS ORDENADOS:", sortedData); // Log 3
        
        // Etapa B: Ordenar as próprias ÁREAS
        const keys = Object.keys(sortedData);
        console.log("### ETAPA B - ÁREAS ANTES DE ORDENAR:", keys); // Log 4
        
        keys.sort((areaA, areaB) => {
          const projectsA = sortedData[areaA];
          const projectsB = sortedData[areaB];
          
          // Usando parseInt aqui também
          const oldestIdA = parseInt((projectsA[0] || {id: Infinity}).id);
          const oldestIdB = parseInt((projectsB[0] || {id: Infinity}).id);
          
          // Log de depuração (mostra a comparação)
          console.log(`Comparando: ${areaA} (ID: ${oldestIdA}) vs ${areaB} (ID: ${oldestIdB})`); // Log 5
          
          return oldestIdA - oldestIdB;
        });

        console.log("### ETAPA B - ÁREAS DEPOIS DE ORDENAR:", keys); // Log 6

        // Etapa C: Salvar AMBOS os estados
        setProjectsByArea(sortedData); 
        setSortedAreaKeys(keys);
        console.log("### ESTADO SALVO. Renderização deve atualizar. ###"); // Log 7
        
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os projetos!", error);
      });
  }, []); // Array de dependências vazio, roda só uma vez

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
      {/* ... seção 'about-section' ... */}
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
        
        {/* Renderiza usando o array de chaves JÁ ORDENADO */}
        {sortedAreaKeys.map(area => (
            <div key={area} style={{ marginBottom: '70px' }}>
              <h3 style={{ fontSize: '22px', color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
                {area}
              </h3>
              <div className="project-grid">
                {/* Acessa os projetos (que também já estão ordenados) */}
                {projectsByArea[area] && projectsByArea[area].map(project => (
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