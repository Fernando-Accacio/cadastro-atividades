// pages/EditAdditionalInfoPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import { FaArrowLeft, FaSave } from 'react-icons/fa';

function EditAdditionalInfoPage() {
    // CORREÇÃO AQUI: Receber 'id' ao invés de 'itemId'
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                // CORREÇÃO AQUI: Usar 'id'
                const response = await api.get(`/api/additional-info/${id}`);
                setText(response.data.text);
                setIsLoading(false);
            } catch (err) {
                console.error("Erro ao buscar item:", err.response || err);
                setError('Erro ao carregar o item. Item não encontrado ou erro de conexão.');
                setIsLoading(false);
            }
        };
        fetchItem();
    // CORREÇÃO AQUI: Dependência mudou
    }, [id]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSaving(true);

        if (!text.trim()) {
            setError('O campo de texto é obrigatório.');
            setIsSaving(false);
            return;
        }

        try {
            // CORREÇÃO AQUI: Usar 'id'
            await api.put(`/api/additional-info/${id}`, { text });
            setMessage('Item atualizado com sucesso!');
            setTimeout(() => {
                navigate('/admin/curriculum');
            }, 1000);
        } catch (err) {
            console.error("Erro ao atualizar item:", err.response || err);
            setError(err.response?.data?.error || 'Erro ao atualizar a informação adicional.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="container"><h1 className="page-title">Carregando Item...</h1></div>;
    }
    
    if (error && !text) {
        return <div className="container"><p className="form-message error">{error}</p></div>;
    }

    return (
        <div className="container">
            {/* CORREÇÃO AQUI: Usar 'id' */}
            <h1 className="page-title">Editar Informação Adicional (ID: {id})</h1>
            
            <Link to="/admin/curriculum" className="back-to-admin">
                <FaArrowLeft /> Voltar ao Painel do Currículo
            </Link>
            
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="text">Texto da Informação</label>
                    <textarea 
                        id="text" 
                        rows="4" 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        placeholder="Ex: Disponibilidade para aprender, colaborar e crescer dentro da empresa."
                        required 
                        style={{resize: 'vertical'}}
                    />
                </div>

                <button type="submit" disabled={isSaving} className="add-button">
                    {isSaving ? 'Salvando...' : <><FaSave /> Salvar Alterações</>}
                </button>
                
                {error && <p className="form-message error">{error}</p>}
                {message && <p className="form-message success">{message}</p>}
            </form>
        </div>
    );
}

export default EditAdditionalInfoPage;