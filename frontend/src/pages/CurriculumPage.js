import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { FaDownload } from 'react-icons/fa';

// Estilos de base para recriar o visual limpo do PDF/Glassmorphism
const curriculumStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)', // <-- aqui
    border: '1px solid rgba(255, 255, 255, 0.5)',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    lineHeight: '1.6'
};

const sectionTitleStyle = {
    marginBottom: '15px',
    marginTop: '10px',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '1.5em',
};

const separatorStyle = {
    border: 'none',
    borderTop: '2px solid rgba(0, 0, 0, 0.08)',
    margin: '30px 0'
};

const personalInfoStyle = {
    textAlign: 'center',
    marginBottom: '0',
    color: 'var(--text-secondary)'
};

// CONSTANTES PADRÃO (FALLBACKS)
const DEFAULT_CONSTS = {
    NAME: "Seu Nome",
    CONTACT_INFO: "Telefone: (11) 9XXXX-XXXX | E-mail: seuemail@gmail.com",
    ADDRESS: "Endereço: Seu endereço",
    RESPONSIBLE: "Responsável: (11) 9XXXX-XXXX (Mãe)",
    OBJECTIVE: "Busco minha primeira oportunidade profissional. Desejo ingressar no mercado para adquirir experiência prática, colocar em uso meus conhecimentos técnicos e desenvolver novas habilidades que me ajudem a crescer profissionalmente."
};


function CurriculumPage() {
    const [info, setInfo] = useState({});
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const downloadUrl = `${api.defaults.baseURL}/api/download/curriculo`;

    const groupSkills = (skillsArray) => {
        const grouped = skillsArray.reduce((acc, skill) => {
            const category = skill.category || 'Geral'; 
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(skill.name);
            return acc;
        }, {});
        
        return Object.keys(grouped).map(category => ({
            category: category,
            names: grouped[category]
        }));
    };
    
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [infoRes, expRes, eduRes, skillRes, addInfoRes] = await Promise.all([
                    api.get('/api/general-info'),
                    api.get('/api/experiences'),
                    api.get('/api/education'),
                    api.get('/api/skills'),
                    api.get('/api/additional-info'), 
                ]);
                
                setInfo(infoRes.data);
                setExperiences(expRes.data);
                setEducation(eduRes.data);
                setSkills(skillRes.data);
                setAdditionalInfo(addInfoRes.data); 
                
            } catch (error) {
                console.error("Erro ao buscar dados do currículo:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const groupedSkills = groupSkills(skills);

    // Renderiza os dados dinâmicos do cabeçalho
    const fullName = info.full_name || DEFAULT_CONSTS.NAME;
    
    // Agora usando info.address que virá do Admin
    const addressLine = info.address ? `Endereço: ${info.address}` : DEFAULT_CONSTS.ADDRESS;
    
    // Nova lógica de contato usando info.phone e info.email
    const contactParts = [];
    if (info.phone) contactParts.push(`Telefone: ${info.phone}`);
    if (info.email) contactParts.push(`E-mail: ${info.email}`);
    const contactLine = contactParts.length > 0 ? contactParts.join(' | ') : DEFAULT_CONSTS.CONTACT_INFO;

    // Agora usando info.responsible que virá do Admin
    const responsibleLine = info.responsible ? `Responsável: ${info.responsible}` : DEFAULT_CONSTS.RESPONSIBLE;

    // ALTERAÇÃO CRÍTICA: Prioriza apenas resume_summary, desvinculando de 'objective' da Home
    const objectiveText = info.resume_summary || DEFAULT_CONSTS.OBJECTIVE;


    if (isLoading) {
        return <div className="container"><h2 className="page-title">Carregando Currículo...</h2></div>;
    }

    return (
        <div className="container">
            <h2 className="page-title">Currículo</h2>

            <div style={curriculumStyle}>
                {/* --- 1. INFORMAÇÕES PESSOAIS (DINÂMICAS) --- */}
                <div style={personalInfoStyle}>
                    <h1 style={{fontSize: '2.5em'}}>{fullName}</h1>
                    <p style={{whiteSpace: 'pre-line'}}>
                        {addressLine}<br />
                        {contactLine}<br />
                        {responsibleLine}
                    </p>
                </div>

                <hr style={separatorStyle} />

                {/* --- 2. OBJETIVO (DINÂMICO) --- */}
                {objectiveText && (
                    <>
                        <h3 style={sectionTitleStyle}>Objetivo</h3>
                        <p style={{color: 'var(--text-secondary)'}}>
                            {objectiveText}
                        </p>
                        <hr style={separatorStyle} />
                    </>
                )}

                {/* --- 3. FORMAÇÃO ACADÊMICA (DINÂMICA) --- */}
                {education.length > 0 && (
                    <>
                        <h3 style={sectionTitleStyle}>Formação Acadêmica</h3>
                        {education.map(edu => (
                            <div key={edu.id} style={{ marginBottom: '20px' }}>
                                <p style={{ fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>
                                    {edu.degree}
                                </p>
                                <p style={{ margin: '5px 0', color: 'var(--text-secondary)' }}>
                                    {edu.institution} - Concluído em {edu.completion_date}
                                </p>
                                {/* Formatação para detalhes (Destaque Acadêmico, etc.) */}
                                {edu.details && (
                                    <p 
                                        style={{ 
                                            fontStyle: 'italic', 
                                            color: 'var(--text-tertiary)', 
                                            fontSize: '0.9em',
                                            whiteSpace: 'pre-wrap' // Permite quebras de linha
                                        }}
                                    >
                                        {edu.details}
                                    </p>
                                )}
                            </div>
                        ))}
                        <hr style={separatorStyle} />
                    </>
                )}

                {/* --- 4. EXPERIÊNCIA PROFISSIONAL (DINÂMICA) --- */}
                <h3 style={sectionTitleStyle}>Experiência Profissional</h3>
                {experiences.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
                        {DEFAULT_CONSTS.OBJECTIVE}
                    </p>
                ) : (
                    experiences.map(exp => (
                        <div key={exp.id} style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>
                                {exp.title} - {exp.company}
                            </p>
                            <p style={{ margin: '5px 0 10px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                                {exp.start_date} a {exp.end_date}
                            </p>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {/* Divide a descrição por quebras de linha para listar as atividades */}
                                {exp.description.split('\n').map((item, i) => (
                                    item.trim() && <li key={i} style={{ color: 'var(--text-secondary)' }}>{item.trim()}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
                <hr style={separatorStyle} />

                {/* --- 5. HABILIDADES TÉCNICAS E COMPORTAMENTAIS (DINÂMICA) --- */}
                {groupedSkills.length > 0 && (
                    <>
                        <h3 style={sectionTitleStyle}>Competências e Habilidades</h3>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {/* Lista todos os nomes de habilidades agrupados, como no PDF */}
                            {groupedSkills.flatMap(group => 
                                group.names.map((name, i) => (
                                    <li key={`${group.category}-${i}`} style={{ color: 'var(--text-secondary)' }}>{name}</li>
                                ))
                            )}
                        </ul>
                        <hr style={separatorStyle} />
                    </>
                )}
                
                {/* --- 6. INFORMAÇÕES ADICIONAIS (DINÂMICA) --- */}
                {additionalInfo.length > 0 && (
                    <>
                        <h3 style={sectionTitleStyle}>Informações Adicionais</h3>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {additionalInfo.map(item => (
                                <li key={item.id} style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                        <hr style={separatorStyle} />
                    </>
                )}

            </div>

            {/* --- BOTÃO DE DOWNLOAD (DINÂMICO) --- */}
            {info.pdf_url ? ( 
                <a 
                    href={downloadUrl} // <-- MUDANÇA CRÍTICA AQUI
                    rel="noopener noreferrer" 
                    className="download-button"
                >
                    <FaDownload style={{marginRight: '8px'}}/> Baixar Currículo (PDF)
                </a>
            ) : (
                <p style={{textAlign: 'center', marginTop: '30px', color: 'var(--text-danger)'}}>
                    O arquivo PDF do currículo ainda não foi carregado pelo administrador.
                </p>
            )}
        </div>
    );
}

export default CurriculumPage;