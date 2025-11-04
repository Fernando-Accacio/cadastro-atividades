import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaSave, FaTrash, FaPencilAlt, FaDownload, FaFilePdf, FaEdit, FaInfoCircle, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

function CurriculumAdminPage({ isAuthenticated }) {
    const navigate = useNavigate();
    
    // --- ALTERAÇÃO 1: Adicionar os novos booleans ao estado ---
    const [generalInfo, setGeneralInfo] = useState({
        full_name: '', address: '', phone: '', email: '',
        responsible: '', resume_summary: '', pdf_url: '',
        experience_fallback_text: '', 
        show_education: true, // NOVO
        show_skills: true,    // NOVO
        show_additional_info: true // NOVO
    });
    // --- Fim da Alteração 1 ---

    const [resumeSummary, setResumeSummary] = useState(''); 
    const [pdfFile, setPdfFile] = useState(null);
    const downloadUrl = `${api.defaults.baseURL}/api/download/curriculo`;
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showNoExperienceInput, setShowNoExperienceInput] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState([]); 
    
    const fetchAllCurriculumData = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        try {
            const [infoRes, expRes, eduRes, skillRes, addInfoRes] = await Promise.all([
                api.get('/api/general-info'),
                api.get('/api/experiences'),
                api.get('/api/education'),
                api.get('/api/skills'),
                api.get('/api/additional-info'), 
            ]);
            
            // --- ALTERAÇÃO 2: Carregar os novos booleans ---
            setGeneralInfo({
                full_name: infoRes.data.full_name || '',
                address: infoRes.data.address || '',
                phone: infoRes.data.phone || '',
                email: infoRes.data.email || '',
                responsible: infoRes.data.responsible || '',
                resume_summary: infoRes.data.resume_summary || '',
                pdf_url: infoRes.data.pdf_url || '',
                experience_fallback_text: infoRes.data.experience_fallback_text || '',
                show_education: infoRes.data.show_education, // NOVO
                show_skills: infoRes.data.show_skills,       // NOVO
                show_additional_info: infoRes.data.show_additional_info // NOVO
            });
            // --- Fim da Alteração 2 ---

            setResumeSummary(infoRes.data.resume_summary || ''); 
            setExperiences(expRes.data);
            setEducation(eduRes.data);
            setSkills(skillRes.data);
            setAdditionalInfo(addInfoRes.data); 
            setError('');
        } catch (err) {
            console.error("Erro ao carregar dados do currículo:", err.response || err);
            const errorMsg = err.response?.data?.error || "Erro ao carregar dados. O backend pode estar dessincronizado (Erro 500).";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin'); 
        } else {
            fetchAllCurriculumData();
        }
    }, [isAuthenticated, navigate, fetchAllCurriculumData]);

    
    // --- ALTERAÇÃO 3: handleInfoChange agora aceita checkboxes ---
    const handleInfoChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            // Se for checkbox, usa o 'checked'
            setGeneralInfo(prev => ({ ...prev, [name]: checked }));
        } else {
            // Senão, usa o 'value' (lógica antiga)
            let val = value;

            setGeneralInfo(prev => ({ ...prev, [name]: val }));
        }
    };
    // --- Fim da Alteração 3 ---

    const handlePdfFileChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    const handleGeneralInfoSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setIsLoading(true);
        const formData = new FormData();
        
        // --- ALTERAÇÃO 4: Adicionar os booleans ao FormData ---
        formData.append('full_name', generalInfo.full_name || '');
        formData.append('address', generalInfo.address || '');
        formData.append('phone', generalInfo.phone || ''); 
        formData.append('email', generalInfo.email || '');
        formData.append('responsible', generalInfo.responsible || '');
        formData.append('resume_summary', resumeSummary);
        formData.append('experience_fallback_text', generalInfo.experience_fallback_text || '');
        
        // Adiciona os novos booleans (eles serão convertidos para "true" ou "false" string)
        formData.append('show_education', generalInfo.show_education);
        formData.append('show_skills', generalInfo.show_skills);
        formData.append('show_additional_info', generalInfo.show_additional_info);
        // --- Fim da Alteração 4 ---

        if (pdfFile) {
            formData.append('pdf_file', pdfFile);
        } else {
            formData.append('pdf_url', generalInfo.pdf_url || ''); 
        }

        try {
            const response = await api.put('/api/general-info', formData);
            
            // --- ALTERAÇÃO 5: Recarregar os booleans no estado ---
            setGeneralInfo(prev => ({ 
                ...prev, ...response.data, 
                pdf_url: response.data.pdf_url || '',
                resume_summary: response.data.resume_summary || '',
                phone: response.data.phone || '',
                responsible: response.data.responsible || '',
                experience_fallback_text: response.data.experience_fallback_text || '',
                show_education: response.data.show_education, // NOVO
                show_skills: response.data.show_skills,       // NOVO
                show_additional_info: response.data.show_additional_info // NOVO
            }));
            // --- Fim da Alteração 5 ---

            setResumeSummary(response.data.resume_summary || '');
            setPdfFile(null); 
            setMessage('Informações Principais e Arquivo atualizados com sucesso!');
        } catch (err) {
            console.error("Erro ao salvar General Info:", err.response || err);
            setError(err.response?.data?.error || 'Erro ao salvar informações gerais.');
        } finally {
            setIsLoading(false);
            fetchAllCurriculumData(); 
        }
    };

    // --- handleDelete (sem alterações) ---
    const handleDelete = (endpoint, id, name) => {
        
        let apiPath = endpoint;
        if (endpoint === 'experience') {
            apiPath = 'experiences';
        } else if (endpoint === 'skill') {
            apiPath = 'skills';
        }

        if (window.confirm(`Tem certeza que deseja apagar "${name}" (ID: ${id})? Esta ação não pode ser desfeita.`)) {
            
            api.delete(`/api/${apiPath}/${id}`)
                .then(() => {
                    setMessage(`${name} apagado com sucesso!`);
                    fetchAllCurriculumData(); 
                })
                .catch(err => {
                    setError(`Erro ao apagar ${name}. Verifique o console (F12).`);
                    console.error("Erro ao deletar:", err);
                });
        }
    };

    if (isLoading) {
        return <div className="container"><h1 className="page-title">Carregando Painel do Currículo...</h1></div>;
    }

    // --- renderActionCell (sem alterações) ---
    const renderActionCell = (item, endpoint) => (
        <td data-label="Ações" className="admin-actions-cell">
            <Link 
                to={`/admin/curriculum/edit-${endpoint}/${item.id}`} 
                className="edit-button-small"
            >
                <FaPencilAlt /> Editar
            </Link>
            <button
                className="danger-button-small"
                onClick={() => handleDelete(endpoint, item.id, item.title || item.name || item.degree || item.text || 'Item')}
            >
                <FaTrash /> Deletar
            </button>
        </td>
    );

    return (
        <div className="container">
            <h1 className="page-title">Gerenciar Currículo</h1>
            
            <Link to="/admin" className="back-to-admin">
                <FaArrowLeft /> Voltar ao Painel Admin
            </Link>
            
            <hr className="form-divider" />
            
            {error && <p className="form-message error">{error}</p>}
            {message && <p className="form-message success">{message}</p>}

            {/* --- 1. INFORMAÇÕES PESSOAIS (Formulário com alterações) --- */}
            <div className="general-info-section">
                <h2>Informações Pessoais, Objetivo e Arquivo</h2>
                <p>Gerencie os dados de contato do currículo e o seu Objetivo Profissional.</p>
                
                <form onSubmit={handleGeneralInfoSubmit}>
                    <h3>Dados de Cabeçalho do Currículo</h3>
                    <div className="form-group">
                        <label htmlFor="full_name"><FaUser /> Nome Completo</label>
                        <input type="text" id="full_name" name="full_name" value={generalInfo.full_name || ''} onChange={handleInfoChange} placeholder="Seu nome"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address"><FaMapMarkerAlt /> Endereço</label>
                        <input type="text" id="address" name="address" value={generalInfo.address || ''} onChange={handleInfoChange} placeholder="Rua XXX, número XXX"/>
                    </div>
                    <div className="form-group-inline">
                        <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
                            <label htmlFor="phone"><FaPhone /> Telefone</label>
                            <input type="text" id="phone" name="phone" value={generalInfo.phone || ''} onChange={handleInfoChange} placeholder="11 99999-9999"/>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="email"><FaEnvelope /> E-mail</label>
                            <input type="email" id="email" name="email" value={generalInfo.email || ''} onChange={handleInfoChange} placeholder="seuemail@gmail.com"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="responsible"><FaUsers /> Contato Responsável</label>
                        <input type="text" id="responsible" name="responsible" value={generalInfo.responsible || ''} onChange={handleInfoChange} placeholder="11 99999-9999"/>
                    </div>
                    
                    <hr className="form-divider" />
                    
                    <h3>Textos Principais</h3>
                    <div className="form-group">
                        <label htmlFor="resumeSummary">Objetivo Profissional (Texto do Currículo)</label>
                        <textarea id="resumeSummary" name="resumeSummary" rows="5" value={resumeSummary || ''} onChange={(e) => setResumeSummary(e.target.value)} placeholder="Seu resumo ou objetivo profissional detalhado para o currículo." style={{resize: 'vertical'}}/>
                        <small>Este texto é exclusivo para o currículo. O texto principal da Home é editado no painel Admin principal.</small>
                    </div>

                    <hr className="form-divider" />

                    {/* --- ALTERAÇÃO 6: Adicionar Checkboxes --- */}
                    <h3>Visibilidade das Seções</h3>
                    <p>Desmarque uma seção para ocultá-la completamente do currículo público (incluindo os exemplos "default").</p>
                    <div className="form-group-checkbox">
                        <input
                            type="checkbox"
                            id="show_education"
                            name="show_education"
                            checked={generalInfo.show_education}
                            onChange={handleInfoChange}
                        />
                        <label htmlFor="show_education">Exibir Seção "Formação Acadêmica"</label>
                    </div>
                    <div className="form-group-checkbox">
                        <input
                            type="checkbox"
                            id="show_skills"
                            name="show_skills"
                            checked={generalInfo.show_skills}
                            onChange={handleInfoChange}
                        />
                        <label htmlFor="show_skills">Exibir Seção "Competências e Habilidades"</label>
                    </div>
                    <div className="form-group-checkbox">
                        <input
                            type="checkbox"
                            id="show_additional_info"
                            name="show_additional_info"
                            checked={generalInfo.show_additional_info}
                            onChange={handleInfoChange}
                        />
                        <label htmlFor="show_additional_info">Exibir Seção "Informações Adicionais"</label>
                    </div>
                    {/* --- Fim da Alteração 6 --- */}


                    <hr className="form-divider" />
                    
                    <h3>Arquivo PDF</h3>
                    <div className="form-group">
                        <label htmlFor="pdf_file"><FaFilePdf /> Currículo para Download (PDF)</label>
                        <input type="file" name="pdf_file" accept="application/pdf" onChange={handlePdfFileChange} />
                        {generalInfo.pdf_url ? (
                            <p style={{marginTop: '5px'}}>
                                <FaDownload /> PDF atual: 
                                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                                    Baixar para conferir
                                </a>
                            </p>
                        ) : (
                            <p style={{color: 'var(--text-danger)', marginTop: '5px'}}>Nenhum PDF cadastrado.</p>
                        )}
                        <small>{pdfFile ? `Novo PDF selecionado: ${pdfFile.name}` : 'Envie um novo PDF para substituir o atual.'}</small>
                    </div>

                    <div className="admin-actions">
                        <button type="submit" className="btn-save-general" disabled={isLoading}>
                            <FaSave /> Salvar Informações Principais
                        </button>
                    </div>
                </form>
            </div>

            <hr className="form-divider" />
            
            {/* --- 2. EXPERIÊNCIA (sem alterações) --- */}
            <div className="admin-section">
                <h2>Experiência Profissional</h2>
                <div className="admin-actions">
                    <Link to="/admin/curriculum/add-experience" className="add-button" style={{backgroundColor: '#28a745'}}>
                        <FaPlus /> Adicionar Experiência
                    </Link>
                    <button type="button" onClick={() => setShowNoExperienceInput(!showNoExperienceInput)} className="add-button" style={{ backgroundColor: showNoExperienceInput ? '#dc3545' : '#ffc107', color: '#212529', marginLeft: '10px' }}>
                        <FaEdit /> {showNoExperienceInput ? 'Cancelar Edição' : 'Editar Texto "Sem Experiência"'}
                    </button>
                </div>
                {showNoExperienceInput && (
                    <form onSubmit={handleGeneralInfoSubmit} className="admin-credentials-form" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                        <div className="form-group">
                            <label htmlFor="experience_fallback_text">Texto para "Sem Experiência"</label>
                            <textarea id="experience_fallback_text" name="experience_fallback_text" rows="4" value={generalInfo.experience_fallback_text || ''} onChange={handleInfoChange} placeholder="Ex: Em busca da primeira oportunidade profissional." style={{resize: 'vertical'}}/>
                            <small>
                                Este texto aparecerá na seção "Experiência" SE não houver nenhuma experiência cadastrada.
                                <br/>
                                <strong>Para OCULTAR a seção "Experiência"</strong>, salve este campo vazio (e não cadastre nenhuma experiência).
                            </small>
                        </div>
                        <div className="admin-actions">
                            <button type="submit" className="add-button" disabled={isLoading}>
                                <FaSave /> Salvar Texto (Salva todas Informações Principais)
                            </button>
                        </div>
                    </form>
                )}
                <hr className="form-divider" />
                <table className="data-table">
                    <thead><tr><th>Cargo/Empresa</th><th>Período</th><th>Ações</th></tr></thead>
                    <tbody>
                        {experiences.length === 0 ? (
                            <tr><td colSpan="3" style={{textAlign: 'center', fontStyle: 'italic'}}>Nenhuma experiência cadastrada.</td></tr>
                        ) : (
                            experiences.map(exp => (
                                <tr key={exp.id}>
                                    <td data-label="Cargo">{exp.title} na {exp.company}</td>
                                    <td data-label="Período">{exp.start_date} - {exp.end_date}</td>
                                    {renderActionCell(exp, 'experience')}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr className="form-divider" />

            {/* --- 3. FORMAÇÃO ACADÊMICA (sem alterações) --- */}
            <div className="admin-section">
                <h2>Formação Acadêmica</h2>
                <div className="admin-actions">
                    <Link to="/admin/curriculum/add-education" className="add-button" style={{backgroundColor: '#28a745'}}>
                        <FaPlus /> Adicionar Formação
                    </Link>
                </div>
                <hr className="form-divider" />
                <table className="data-table">
                    <thead><tr><th>Formação/Curso</th><th>Instituição</th><th>Período</th><th>Ações</th></tr></thead>
                    <tbody>
                        {education.length === 0 ? (
                            <tr><td colSpan="4" style={{textAlign: 'center', fontStyle: 'italic'}}>Nenhuma formação cadastrada.</td></tr>
                        ) : (
                            education.map(edu => (
                                <tr key={edu.id}>
                                    <td data-label="Formação">{edu.degree}</td>
                                    <td data-label="Instituição">{edu.institution}</td>
                                    <td data-label="Período">{edu.start_date} - {edu.end_date}</td>
                                    {renderActionCell(edu, 'education')}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr className="form-divider" />
            
            {/* --- 4. HABILIDADES (SKILLS) (sem alterações) --- */}
            <div className="admin-section">
                <h2>Habilidades (Skills)</h2>
                <div className="admin-actions">
                    <Link to="/admin/curriculum/add-skill" className="add-button" style={{backgroundColor: '#28a745'}}>
                        <FaPlus /> Adicionar Habilidade
                    </Link>
                </div>
                <hr className="form-divider" />
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Habilidade</th>
                            <th>Categoria</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.length === 0 ? (
                            <tr><td colSpan="3" style={{textAlign: 'center', fontStyle: 'italic'}}>Nenhuma habilidade cadastrada.</td></tr>
                        ) : (
                            skills.map(skill => (
                                <tr key={skill.id}>
                                    <td data-label="Habilidade">{skill.name}</td>
                                    <td data-label="Categoria">{skill.category}</td>
                                    {renderActionCell(skill, 'skill')}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr className="form-divider" />

            {/* --- 5. INFORMAÇÕES ADICIONAIS (sem alterações) --- */}
            <div className="admin-section">
                <h2><FaInfoCircle /> Informações Adicionais</h2>
                <div className="admin-actions">
                    <Link to="/admin/curriculum/add-additional-info" className="add-button" style={{backgroundColor: '#5bc0de'}}>
                        <FaPlus /> Adicionar Item
                    </Link>
                </div>
                <hr className="form-divider" />
                <table className="data-table">
                    <thead><tr><th>ID</th><th>Texto da Informação</th><th>Ações</th></tr></thead>
                    <tbody>
                        {additionalInfo.length === 0 ? (
                            <tr><td colSpan="3" style={{textAlign: 'center', fontStyle: 'italic'}}>Nenhuma informação adicional cadastrada.</td></tr>
                        ) : (
                            additionalInfo.map(item => (
                                <tr key={item.id}>
                                    <td data-label="ID">{item.id}</td>
                                    <td data-label="Texto">{item.text}</td>
                                    {renderActionCell(item, 'additional-info')}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
}

export default CurriculumAdminPage;