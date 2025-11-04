import React, { useState } from 'react';
import axios from 'axios';

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

    axios.post('/api/contact', formData)
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

  return (
    <div id="contact" className="contact-form">
        <h2 className='page-title'>Formulário de Contato</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="message">Mensagem</label>
                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <button type="submit">Enviar</button>
        </form>
        
        {statusMessage && (
          <p 
            className={`form-message ${messageType}`}
            style={{
              textAlign: 'center', 
              marginTop: '15px',
              padding: '12px',
              borderRadius: '8px',
              color: messageType === 'success' ? '#155724' : messageType === 'error' ? '#721c24' : '#0c5460',
              border: `1px solid ${messageType === 'success' ? '#c3e6cb' : messageType === 'error' ? '#f5c6cb' : '#bee5eb'}`,
              fontWeight: '500'
            }}
          >
            {statusMessage}
          </p>
        )}
    </div>
  );
}

export default ContactForm;