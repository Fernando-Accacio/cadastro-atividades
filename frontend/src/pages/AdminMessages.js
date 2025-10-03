import React, { useState, useEffect } from 'react';
import axios from 'axios';

// NOVO: Estilos para o container do input de senha e para o ícone do olho
const passwordContainerStyle = {
  position: 'relative',
  width: '100%'
};

const passwordToggleStyle = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  userSelect: 'none' // Impede que o texto do olho seja selecionado
};


function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // NOVO: Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://127.0.0.1:5000/api/messages')
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error("Houve um erro ao buscar as mensagens!", error);
        });
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'marcelo2007') { // Escolher a senha correta
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h2 className="page-title">Acesso Restrito</h2>
        <p>Por favor, insira a senha para ver as mensagens.</p>
        <form onSubmit={handlePasswordSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            {/* NOVO: Container para o input e o ícone do olho */}
            <div style={passwordContainerStyle}>
              <input 
                // O tipo do input agora é dinâmico (text ou password)
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {/* NOVO: Ícone do olho que chama a função para alternar a visibilidade */}
              <span 
                style={passwordToggleStyle} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <button type="submit">Entrar</button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Mensagens Recebidas</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Mensagem</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{new Date(msg.timestamp + 'Z').toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'})}</td>
              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>{msg.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMessages;