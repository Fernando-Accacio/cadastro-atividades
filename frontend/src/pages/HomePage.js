import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import ProjectCard from '../components/ProjectCard';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

const DEFAULT_PROFILE_PIC = "/images/marcelo-foto.jpg"; 

function HomePage() {
  const [projectsByArea, setProjectsByArea] = useState({});
  const [sortedAreaKeys, setSortedAreaKeys] = useState([]);
  const [profilePicUrl, setProfilePicUrl] = useState(DEFAULT_PROFILE_PIC);
  const [generalInfo, setGeneralInfo] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // Força re-render dos cards

  // Função de busca de projetos (Sem alteração)
  const fetchProjects = useCallback(() => {
    api.get('/api/projects')
      .then(response => {
        const data = response.data;
        const sortedData = {};
        for (const area in data) {
          const projects = data[area];
          if (Array.isArray(projects)) {
            const sortedProjects = projects.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            sortedData[area] = sortedProjects;
          }
        }
        const keys = Object.keys(sortedData);
        keys.sort((areaA, areaB) => {
          const projectsA = sortedData[areaA];
          const projectsB = sortedData[areaB];
          const oldestIdA = parseInt((projectsA[0] || {id: Infinity}).id);
          const oldestIdB = parseInt((projectsB[0] || {id: Infinity}).id);
          return oldestIdA - oldestIdB;
        });
        setProjectsByArea(sortedData); 
        setSortedAreaKeys(keys);
      })
      .catch(error => console.error("Houve um erro ao buscar os projetos!", error));
  }, []);

  // Fetch inicial (Sem alteração)
  useEffect(() => {
    fetchProjects();
      
    api.get('/api/general-info')
      .then(response => {
        setGeneralInfo(response.data);
        if (response.data.profile_pic_url) {
          setProfilePicUrl(response.data.profile_pic_url);
        }
      })
      .catch(error => console.error("Houve um erro ao buscar General Info!", error));
  }, [fetchProjects]);

  // Função de voto OTIMIZADA (Sem alteração)
  const handleVoteUpdate = (updatedProject) => {
    const area = updatedProject.area_saber || updatedProject.area || updatedProject.category;

    if (!area) {
      console.warn("⚠️ updatedProject sem área! Dados recebidos:", updatedProject);
      return;
    }

    // Atualização instantânea COM força total
    setProjectsByArea(prev => {
      const currentArea = prev[area] || [];
      const updatedArea = currentArea.map(p =>
        p.id === updatedProject.id 
          ? { ...updatedProject } // Substitui o objeto inteiro
          : p
      );
      return {
        ...prev,
        [area]: updatedArea
      };
    });

    // Força re-render dos cards
    setRefreshKey(k => k + 1);

    // Recarga do servidor pra garantir
    setTimeout(() => {
      fetchProjects();
      setRefreshKey(k => k + 1);
    }, 500);
  };

  const objectiveText = generalInfo.objective || "Sou Marcelo, tenho 18 anos, e estudo Internet das Coisas (IoT) no Senac Nações Unidas. Tenho um grande interesse por tecnologia, inovação e segurança digital, e busco minha primeira oportunidade profissional para aplicar meus conhecimentos e evoluir na área. Sou curioso, dedicado e colaborativo, sempre em busca de aprender mais e entregar o meu melhor em cada desafio.";

  // Define o nome principal, usando 'main_name' se existir, ou o nome estático como fallback
  const mainName = generalInfo.main_name || "Marcelo Antony Accacio Olhier";

  return (
    <div className="container">
      <section className="about-section">
        <img src={profilePicUrl} alt="Foto do Aluno" />
        
        {/* CORREÇÃO AQUI: Usar a variável dinâmica mainName */}
        <h2>{mainName}</h2> 
        
        <p>
          {objectiveText}
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
        
        {sortedAreaKeys.map(area => (
          <div key={area}>
            <h3 className="area-saber-titulo">
              {area}
            </h3>
            <div className="project-grid">
              {projectsByArea[area] && projectsByArea[area].map(project => (
                <ProjectCard 
                  key={`${project.id}-${refreshKey}`} 
                  project={project} 
                  onVote={handleVoteUpdate} 
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HomePage;