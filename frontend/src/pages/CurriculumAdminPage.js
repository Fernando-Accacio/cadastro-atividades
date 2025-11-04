import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaSave, FaTrash, FaPencilAlt, FaDownload, FaFilePdf, FaEdit, FaInfoCircle, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

function CurriculumAdminPage({ isAuthenticated }) {
    const navigate = useNavigate();
    
    // --- Estados para General Info (Objetivo, PDF, Pessoais) ---
    // Adicionado full_name, address, phone, email, responsible
    const [generalInfo, setGeneralInfo] = useState({
        full_name: '',
        address: '',
        phone: '',
        email: '',
        responsible: '',
        resume_summary: '', // Objetivo do currículo
        pdf_url: '', // URL do PDF atual
    });
    const [resumeSummary, setResumeSummary] = useState(''); 
    const [pdfFile, setPdfFile] = useState(null);
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // --- Estados para Dados Estruturados (Listas) ---
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState([]); 
    
    // --- Funções de Fetch ---
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
            
            // Popula o estado com os campos pessoais e de currículo
            setGeneralInfo({
                full_name: infoRes.data.full_name || '',
                address: infoRes.data.address || '',
                phone: infoRes.data.phone || '',
                email: infoRes.data.email || '',
                responsible: infoRes.data.responsible || '',
                resume_summary: infoRes.data.resume_summary || '',
                pdf_url: infoRes.data.pdf_url || '',
                // Removidos 'objective' e 'profile_pic_url' daqui
            });
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

    // --- Handlers de Upload/General Info ---

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setGeneralInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePdfFileChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    const handleGeneralInfoSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        const formData = new FormData();
        
        // CORREÇÃO CRÍTICA: Envio dos CAMPOS PESSOAIS
        formData.append('full_name', generalInfo.full_name || '');
        formData.append('address', generalInfo.address || '');
        formData.append('phone', generalInfo.phone || '');
        formData.append('email', generalInfo.email || '');
        formData.append('responsible', generalInfo.responsible || '');
        
        // OBJETIVO (APENAS CURRÍCULO) - Usa 'resume_summary'
        formData.append('resume_summary', resumeSummary);
        
        // PDF
        if (pdfFile) {
            formData.append('pdf_file', pdfFile);
        } else {
            formData.append('pdf_url', generalInfo.pdf_url || ''); 
        }

        try {
            const response = await api.put('/api/general-info', formData);
            setGeneralInfo(prev => ({ 
                ...prev, 
                ...response.data, 
                pdf_url: response.data.pdf_url, 
                resume_summary: response.data.resume_summary 
            }));
            setResumeSummary(response.data.resume_summary);
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

    // --- Handlers de Delete para Listas (mantidos) ---
    
    const handleDelete = (endpoint, id, name) => {
        if (window.confirm(`Tem certeza que deseja apagar "${name}" (ID: ${id})? Esta ação não pode ser desfeita.`)) {
            api.delete(`/api/${endpoint}/${id}`)
                .then(() => {
                    setMessage(`${name} apagado com sucesso!`);
                    fetchAllCurriculumData(); 
                })
                .catch(err => {
                    setError(`Erro ao apagar ${name}.`);
                    console.error("Erro ao deletar:", err);
                });
        }
    };

    if (isLoading) {
        return <div className="container"><h1 className="page-title">Carregando Painel do Currículo...</h1></div>;
    }

    // Função auxiliar para renderizar botões de delete/edit (mantida)
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

            {/* ========================================================== */}
            {/* 1. INFORMAÇÕES PESSOAIS E OBJETIVO (GeneralInfo) */}
            {/* ========================================================== */}
            <div className="general-info-section">
                <h2><FaEdit /> Informações Pessoais, Objetivo e Arquivo</h2>
                <p>Gerencie os dados de contato do currículo e o seu Objetivo Profissional.</p>

                <form onSubmit={handleGeneralInfoSubmit}>
                    
                    {/* --- DADOS PESSOAIS --- */}
                    <h3>Dados de Cabeçalho do Currículo</h3>

                    <div className="form-group">
                        <label htmlFor="full_name"><FaUser /> Nome Completo</label>
                        <input 
                            type="text" 
                            id="full_name" 
                            name="full_name" 
                            value={generalInfo.full_name || ''} 
                            onChange={handleInfoChange} 
                            placeholder="Marcelo Antony Accacio Olhier"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="address"><FaMapMarkerAlt /> Endereço</label>
                        <input 
                            type="text" 
                            id="address" 
                            name="address" 
                            value={generalInfo.address || ''} 
                            onChange={handleInfoChange} 
                            placeholder="Rua Soldado PM Gilberto Augustinho, 237"
                        />
                    </div>

                    <div className="form-group-inline">
                        <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
                            <label htmlFor="phone"><FaPhone /> Telefone</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                value={generalInfo.phone || ''} 
                                onChange={handleInfoChange} 
                                placeholder="(11) 95314-1962"
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="email"><FaEnvelope /> E-mail</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={generalInfo.email || ''} 
                                onChange={handleInfoChange} 
                                placeholder="marceloaccacio9@gmail.com"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="responsible"><FaUsers /> Contato Responsável</label>
                        <input 
                            type="tel" 
                            id="responsible" 
                            name="responsible" 
                            value={generalInfo.responsible || ''} 
                            onChange={handleInfoChange} 
                            placeholder="(11) 99997-6992 (Mãe)"
                        />
                    </div>

                    <hr className="form-divider" />
                    
                    {/* --- OBJETIVO DO CURRÍCULO --- */}
                    <div className="form-group">
                        <label htmlFor="resumeSummary">Objetivo Profissional (Texto do Currículo)</label>
                        <textarea 
                            id="resumeSummary" 
                            name="resumeSummary" 
                            rows="5"
                            value={resumeSummary} 
                            onChange={(e) => setResumeSummary(e.target.value)} 
                            placeholder="Seu resumo ou objetivo profissional detalhado para o currículo."
                            style={{resize: 'vertical'}}
                        />
                        <small>Este texto é exclusivo para o currículo. O texto principal da Home é editado no painel Admin principal.</small>
                    </div>
                    
                    <hr className="form-divider" />
                    
                    {/* --- PDF DE DOWNLOAD --- */}
                    <div className="form-group">
                        <label htmlFor="pdf_file"><FaFilePdf /> Currículo para Download (PDF)</label>
                        <input type="file" name="pdf_file" accept="application/pdf" onChange={handlePdfFileChange} />
                        {generalInfo.pdf_url ? (
                            <p style={{marginTop: '5px'}}>
                                <FaDownload /> PDF atual: <a href={generalInfo.pdf_url} target="_blank" rel="noopener noreferrer">Baixar para conferir</a>
                            </p>
                        ) : (
                            <p style={{color: 'var(--text-danger)', marginTop: '5px'}}>Nenhum PDF cadastrado.</p>
                        )}
                        <small>{pdfFile ? `Novo PDF selecionado: ${pdfFile.name}` : 'Envie um novo PDF para substituir o atual.'}</small>
                    </div>
                    
                    {/* BOTÃO DE SUBMISSÃO PRINCIPAL */}
                    <div className="admin-actions">
                        <button type="submit" className="btn-save-general" disabled={isLoading}>
                            <FaSave /> Salvar Informações Principais
                        </button>
                    </div>
                </form>
            </div>

            <hr className="form-divider" />
            
            {/* ========================================================== */}
            {/* 2. EXPERIÊNCIA PROFISSIONAL (REINTRODUZIDO) */}
            {/* ========================================================== */}
            <div className="admin-section">
                <h2>Experiência Profissional</h2>
                <div className="admin-actions">
                    <Link to="/admin/curriculum/add-experience" className="add-button" style={{backgroundColor: '#28a745'}}>
                        <FaPlus /> Adicionar Experiência
                    </Link>
                </div>
                <hr className="form-divider" />
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cargo/Empresa</th>
                            <th>Período</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {experiences.length === 0 ? (
                            <tr><td colSpan="3" style={{textAlign: 'center', fontStyle: 'italic'}}>Nenhuma experiência cadastrada.</td></tr>
                        ) : (
                            experiences.map(exp => (
                                <tr key={exp.id}>
                                    <td data-label="Cargo">{exp.title} na {exp.company}</td>
                                    <td data-label="Período">{exp.start_date} - {exp.end_date}</td>
                                    {renderActionCell(exp, 'experiences')}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr className="form-divider" />

            {/* ========================================================== */}
            {/* 3. FORMAÇÃO ACADÊMICA (REINTRODUZIDO) */}
            {/* ========================================================== */}
            <div className="admin-section">
                <h2>Formação Acadêmica</h2>
                <div className="admin-actions">
                    <Link to="/admin/curriculum/add-education" className="add-button" style={{backgroundColor: '#28a745'}}>
                        <FaPlus /> Adicionar Formação
                    </Link>
                </div>
                <hr className="form-divider" />
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Formação/Curso</th>
                            <th>Instituição</th>
                            <th>Conclusão</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {education.length === 0 ? (
                            <tr><td colSpan="4" style={{textAlign: 'center', fontStyle: 'italic'}}>Nenhuma formação cadastrada.</td></tr>
                        ) : (
                            education.map(edu => (
                                <tr key={edu.id}>
                                    <td data-label="Formação">{edu.degree}</td>
                                    <td data-label="Instituição">{edu.institution}</td>
                                    <td data-label="Conclusão">{edu.completion_date}</td>
                                    {renderActionCell(edu, 'education')}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr className="form-divider" />
            
            {/* ========================================================== */}
            {/* 4. HABILIDADES (REINTRODUZIDO) */}
            {/* ========================================================== */}
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
                                    {renderActionCell(skill, 'skills')}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr className="form-divider" />

            {/* ========================================================== */}
            {/* 5. INFORMAÇÕES ADICIONAIS (JÁ ESTAVA) */}
            {/* ========================================================== */}
            <div className="admin-section">
                <h2><FaInfoCircle /> Informações Adicionais</h2>
                <div className="admin-actions">
                    <Link to="/admin/curriculum/add-additional-info" className="add-button" style={{backgroundColor: '#5bc0de'}}>
                        <FaPlus /> Adicionar Item
                    </Link>
                </div>
                <hr className="form-divider" />
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Texto da Informação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
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