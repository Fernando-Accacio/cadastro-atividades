import React, { useState } from 'react';
// *** MANTIDO DO CÓDIGO ATUAL ***
// Importa a instância configurada do Axios
import api from '../api/axiosConfig'; // (ajuste o caminho se necessário)

// *** NOVO: Estilos CSS embutidos ***
// Adicionados aqui para ficarem "dentro do arquivo jsx" como solicitado,
// baseados nos nomes de classe (form-message, success, error) do seu AdminPage.js
const formStyles = `
.form-message {
  padding: 12px 15px;
  margin-top: 20px;
  border-radius: 5px;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid transparent;
  text-align: center;
  /* Uma pequena transição para quando a mensagem desaparece */
  transition: opacity 0.5s ease-out; 
}

/* Estilo de Sucesso (Verde) */
.form-message.success {
  background-color: #d4edda; /* Fundo verde claro */
  border-color: #c3e6cb;     /* Borda verde */
  color: #155724;          /* Texto verde escuro */
}

/* Estilo de Erro (Vermelho) */
.form-message.error {
  background-color: #f8d7da; /* Fundo vermelho claro */
  border-color: #f5c6cb;     /* Borda vermelha */
  color: #721c24;          /* Texto vermelho escuro */
}

/* Estilo de Carregando (Azul/Cinza) */
.form-message.loading {
  background-color: #e2e3e5; /* Fundo cinza claro */
  border-color: #d6d8db;     /* Borda cinza */
  color: #383d41;          /* Texto cinza escuro */
}
`;
// *** FIM DOS ESTILOS ***

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', ou 'loading'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage('Enviando...');
    setMessageType('loading');

    // *** MANTIDO DO CÓDIGO ATUAL ***
    // Usa a instância 'api' em vez de 'axios'
    api.post('/api/contact', formData)
      .then(response => {
        setStatusMessage('Mensagem enviada com sucesso! Obrigado pelo contato.');
        setMessageType('success');
        setFormData({ name: '', email: '', message: '' }); // Limpa o formulário
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
          setStatusMessage('');
          setMessageType('');
        }, 5000);
      })
      .catch(error => {
        setStatusMessage('❌ Erro ao enviar mensagem. Tente novamente.');
        setMessageType('error');
        console.error('Erro no envio do formulário!', error);
        
        // Remove a mensagem de erro após 5 segundos
        setTimeout(() => {
          setStatusMessage('');
          setMessageType('');
        }, 5000);
      });
  };

  // *** CORREÇÃO NO RETORNO ***
  // 1. Adicionado um Fragmento <>...</> para permitir a <style> e o <form>
  // 2. Injetada a tag <style> com os estilos
  // 3. Atualizadas as classNames da div de mensagem de status
  return (
    <>
      {/* *** NOVO: Injeta os estilos CSS definidos acima *** */}
      <style>{formStyles}</style>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <h2>Formulário de Contato</h2>
        
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Mensagem</label>
          <textarea 
            id="message" 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <button type="submit" disabled={messageType === 'loading'}>
          {messageType === 'loading' ? 'Enviando...' : 'Enviar'}
        </button>
        
        {/* *** CORREÇÃO AQUI: Classes atualizadas para corresponder ao CSS *** */}
        {/* Exibe a mensagem de status */}
        {statusMessage && (
          <div className={`form-message ${messageType}`}>
            {statusMessage}
          </div>
        )}
      </form>
    </>
  );
}

export default ContactForm;