import React, { useState } from 'react';
import axios from 'axios';

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage('Enviando...');
    axios.post('http://127.0.0.1:5000/api/contact', formData)
      .then(response => {
        setStatusMessage(response.data.success);
        setFormData({ name: '', email: '', message: '' }); // Limpa o formulário
      })
      .catch(error => {
        setStatusMessage('Erro ao enviar mensagem. Tente novamente.');
        console.error('Erro no envio do formulário!', error);
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
        {statusMessage && <p style={{textAlign: 'center', marginTop: '15px'}}>{statusMessage}</p>}
    </div>
  );
}

export default ContactForm;