import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { FaDownload } from 'react-icons/fa';

// Estilos (sem alterações)
const curriculumStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
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

// CONSTANTES PADRÃO (FALLBACKS) - (Sem alterações)
const DEFAULT_CONSTS = {
    NAME: "Seu Nome",
    CONTACT_INFO: "Telefone: (11) 9XXXX-XXXX | E-mail: seuemail@gmail.com",
    ADDRESS: "Endereço: Seu endereço",
    RESPONSIBLE: "Responsável: (11) 9XXXX-XXXX (Mãe)",
    OBJECTIVE: "Busco minha primeira oportunidade profissional. Desejo ingressar no mercado para adquirir experiência prática, colocar em uso meus conhecimentos técnicos e desenvolver novas habilidades que me ajudem a crescer profissionalmente.",
    DEFAULT_EXPERIENCE_FALLBACK: "Em busca da primeira oportunidade profissional.",
    DEFAULT_EDUCATION: [
      { id: 'default-1', degree: 'Ex: Técnico em Desenvolvimento de Sistemas', institution: 'Ex: ETEC/SENAI', completion_date: '2024', details: 'Ex: Destaque acadêmico em Projetos.' }
    ],
    DEFAULT_SKILLS: [
      { id: 'default-s1', category: 'Ex: Linguagens', name: 'Ex: JavaScript' },
      { id: 'default-s2', category: 'Ex: Ferramentas', name: 'Ex: React.js' },
      { id: 'default-s3', category: 'Ex: Soft Skills', name: 'Ex: Comunicação' }
    ],
    DEFAULT_ADDITIONAL_INFO: [
      { id: 'default-a1', text: 'Ex: Disponibilidade para início imediato.' },
      { id: 'default-a2', text: 'Ex: CNH Categoria B.' }
    ]
};


function CurriculumPage() {
    // --- Estados e Hooks (sem alterações) ---
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

    if (isLoading) {
        return <div className="container"><h2 className="page-title">Carregando Currículo...</h2></div>;
    }

    // --- Lógica de Placeholders e Constantes (sem alterações) ---
    const educationToRender = education.length > 0 ? education : DEFAULT_CONSTS.DEFAULT_EDUCATION;
    const additionalInfoToRender = additionalInfo.length > 0 ? additionalInfo : DEFAULT_CONSTS.DEFAULT_ADDITIONAL_INFO;
    const skillsToRender = skills.length > 0 ? skills : DEFAULT_CONSTS.DEFAULT_SKILLS;
    const groupedSkills = groupSkills(skillsToRender);
    const fullName = info.full_name || DEFAULT_CONSTS.NAME;
    const addressLine = info.address ? `Endereço: ${info.address}` : DEFAULT_CONSTS.ADDRESS;
    const contactParts = [];
    if (info.phone) contactParts.push(`Telefone: ${info.phone}`);
    if (info.email) contactParts.push(`E-mail: ${info.email}`);
    const contactLine = contactParts.length > 0 ? contactParts.join(' | ') : DEFAULT_CONSTS.CONTACT_INFO;
    const responsibleLine = info.responsible ? `Responsável: ${info.responsible}` : DEFAULT_CONSTS.RESPONSIBLE;
    const objectiveText = info.resume_summary || DEFAULT_CONSTS.OBJECTIVE;
    const experienceFallback = info.experience_fallback_text !== undefined && info.experience_fallback_text !== null 
                               ? info.experience_fallback_text 
                               : DEFAULT_CONSTS.DEFAULT_EXPERIENCE_FALLBACK;


    return (
        <div className="container">
            <h2 className="page-title">Currículo</h2>

            <div style={curriculumStyle}>
                {/* --- 1. INFORMAÇÕES PESSOAIS --- (Sem alterações) */}
                <div style={personalInfoStyle}>
                    <h1 style={{fontSize: '2.5em'}}>{fullName}</h1>
                    <p style={{whiteSpace: 'pre-line'}}>
                        {addressLine}<br />
                        {contactLine}<br />
                        {responsibleLine}
                    </p>
                </div>
                <hr style={separatorStyle} />

                {/* --- 2. OBJETIVO --- (Sem alterações) */}
                {objectiveText && (
                    <>
                        <h3 style={sectionTitleStyle}>Objetivo</h3>
                        <p style={{color: 'var(--text-secondary)'}}>
                            {objectiveText}
                        </p>
                        <hr style={separatorStyle} />
                    </>
                )}

                {/* --- 3. FORMAÇÃO ACADÊMICA --- (Sem alterações) */}
                {educationToRender.length > 0 && (
                    <>
                        <h3 style={sectionTitleStyle}>Formação Acadêmica</h3>
                        {educationToRender.map(edu => (
                            <div key={edu.id} style={{ marginBottom: '20px' }}>
                                <p style={{ fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>
                                    {edu.degree}
                                </p>
                                <p style={{ margin: '5px 0', color: 'var(--text-secondary)' }}>
                                    {edu.institution} - Concluído em {edu.completion_date}
                                </p>
                                {edu.details && (
                                    <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', fontSize: '0.9em', whiteSpace: 'pre-wrap' }}>
                                        {edu.details}
                                    </p>
                                )}
                            </div>
                        ))}
                        <hr style={separatorStyle} />
                    </>
                )}

                {/* --- 4. EXPERIÊNCIA PROFISSIONAL --- (Sem alterações) */}
                {(experiences.length > 0 || experienceFallback) && (
                    <>
                        <h3 style={sectionTitleStyle}>Experiência Profissional</h3>
                        {experiences.length === 0 ? (
                            <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
                                {experienceFallback}
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
                                        {exp.description.split('\n').map((item, i) => (
                                            item.trim() && <li key={i} style={{ color: 'var(--text-secondary)' }}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                        <hr style={separatorStyle} />
                    </>
                )}


                {/* ========================================================== */}
                {/* --- 5. HABILIDADES (A SEÇÃO CORRIGIDA) --- */}
                {/* ========================================================== */}
                {groupedSkills.length > 0 && (
                    <>
                        <h3 style={sectionTitleStyle}>Competências e Habilidades</h3>
                        
                        {/* --- CORREÇÃO AQUI --- */}
                        {/* Agora fazemos um loop em cada grupo (em vez de achatar)
                          e renderizamos o título da categoria.
                        */}
                        <div style={{ paddingLeft: '0', margin: 0 }}>
                            {groupedSkills.map(group => (
                                <div key={group.category} style={{ marginBottom: '15px' }}>
                                    
                                    {/* Renderiza o título da Categoria (Ex: "Soft Skill") */}
                                    <strong style={{ 
                                        color: 'var(--text-primary)', 
                                        fontSize: '1.05em', 
                                        display: 'block', 
                                        marginBottom: '5px' 
                                    }}>
                                        {group.category}:
                                    </strong>
                                    
                                    {/* Renderiza a lista de nomes para essa categoria */}
                                    <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                                        {group.names.map((name, i) => (
                                            <li key={`${group.category}-${i}`} style={{ color: 'var(--text-secondary)' }}>
                                                {name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        {/* --- FIM DA CORREÇÃO --- */}

                        <hr style={separatorStyle} />
                    </>
                )}
                
                {/* --- 6. INFORMAÇÕES ADICIONAIS --- (Sem alterações) */}
                {additionalInfoToRender.length > 0 && (
                    <>
                        <h3 style={sectionTitleStyle}>Informações Adicionais</h3>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {additionalInfoToRender.map(item => (
                                <li key={item.id} style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                        <hr style={separatorStyle} />
                    </>
                )}

            </div>

            {/* --- BOTÃO DE DOWNLOAD --- (Sem alterações) */}
            {info.pdf_url ? ( 
                <a 
                    href={downloadUrl} 
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