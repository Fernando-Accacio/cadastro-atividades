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
  const [refreshKey, setRefreshKey] = useState(0); 
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

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

  // Fetch inicial - Gerenciamento de isLoading e consistência
  useEffect(() => {
    fetchProjects();
    
    setIsLoading(true);

    api.get('/api/general-info')
      .then(response => {
        setGeneralInfo({
            objective: response.data.objective || '',
            main_name: response.data.main_name || '',
            profile_pic_url: response.data.profile_pic_url || '',
        });
        setProfilePicUrl(response.data.profile_pic_url || DEFAULT_PROFILE_PIC);
      })
      .catch(error => console.error("Houve um erro ao buscar General Info!", error))
      .finally(() => {
          setIsLoading(false); 
      });
  }, [fetchProjects]);

  // Função de voto OTIMIZADA (sem alteração)
  const handleVoteUpdate = (updatedProject) => {
    const area = updatedProject.area_saber || updatedProject.area || updatedProject.category;

    if (!area) {
      console.warn("⚠️ updatedProject sem área! Dados recebidos:", updatedProject);
      return;
    }

    setProjectsByArea(prev => {
      const currentArea = prev[area] || [];
      const updatedArea = currentArea.map(p =>
        p.id === updatedProject.id 
          ? { ...updatedProject }
          : p
      );
      return {
        ...prev,
        [area]: updatedArea
      };
    });

    setRefreshKey(k => k + 1);

    setTimeout(() => {
      fetchProjects();
      setRefreshKey(k => k + 1);
    }, 500);
  };

  // --- Funções de Renderização Condicional ---
  
  const defaultObjective = "Sou Marcelo, tenho 18 anos, e estudo Internet das Coisas (IoT) no Senac Nações Unidas. Tenho um grande interesse por tecnologia, inovação e segurança digital, e busco minha primeira oportunidade profissional para aplicar meus conhecimentos e evoluir na área. Sou curioso, dedicado e colaborativo, sempre em busca de aprender mais e entregar o meu melhor em cada desafio.";
  const objectiveText = generalInfo.objective || defaultObjective;
  const mainName = generalInfo.main_name || "Marcelo Antony Accacio Olhier";


  const renderImage = () => {
    if (isLoading) {
      // Placeholder circular para a imagem
      return (
        <div 
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#ccc', 
            margin: '0 auto 20px',
            opacity: 0.5 
          }}
        ></div>
      );
    }
    
    // Imagem carregada (ou fallback)
    return <img src={profilePicUrl} alt="Foto do Aluno" />;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <p style={{ textAlign: 'center' }}>
          {/* Duas linhas de placeholder para o texto */}
          <div style={{ width: '80%', height: '18px', backgroundColor: '#f0f0f0', borderRadius: '4px', margin: '5px auto' }}></div>
          <div style={{ width: '60%', height: '18px', backgroundColor: '#f0f0f0', borderRadius: '4px', margin: '5px auto' }}></div>
        </p>
      );
    }

    return (
      <p>
        {objectiveText}
        {' '}
        Venha conhecer um pouco mais{' '}
        <Link to="/sobremim" className="link-effect">
          sobre mim!
        </Link>
      </p>
    );
  };

  return (
    <div className="container">
      <section className="about-section">
        
        {/* Renderiza o placeholder ou a imagem */}
        {renderImage()}
        
        <h2>{isLoading ? 'Carregando...' : mainName}</h2> 
        
        {/* Renderiza o placeholder ou o texto */}
        {renderContent()}
        
        <div className="social-links">
          {/* Os links podem ser exibidos imediatamente, mas o email deve usar a URL correta */}
          <a href="https://www.linkedin.com/in/marcelo-antony-741296363/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={24} />
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/marceloaccacio9-netizen" target="_blank" rel="noopener noreferrer">
            <FaGithub size={24} />
            <span>GitHub</span>
          </a>
          {/* Usa o email do General Info se estiver disponível */}
          <a href={`mailto:${generalInfo.email || 'marceloaccacio9@gmail.com'}`}>
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