import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [messages, setMessages] = useState([]);
  // Este estado controla tudo. Ele começa como 'false'.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const fetchMessages = () => {
    axios.get('http://127.0.0.1:5000/api/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar as mensagens!", error);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Verifique se a senha está correta. Mude '1234' para sua senha.
    if (password === 'marcelo2007') { 
      // Se a senha estiver correta, muda o estado para 'true' e a página recarrega
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  const handleResetVotes = () => {
    if (window.confirm("Você tem CERTEZA que deseja resetar TODOS os votos? Esta ação não pode ser desfeita.")) {
      axios.post('http://127.0.0.1:5000/api/admin/reset-votes')
        .then(response => {
          alert('Votos resetados com sucesso!');
        })
        .catch(err => {
          alert('Ocorreu um erro ao resetar os votos.');
          console.error(err);
        });
    }
  };

  const handleResetMessages = () => {
    if (window.confirm("Você tem CERTEZA que deseja apagar TODAS as mensagens? Esta ação não pode ser desfeita.")) {
      axios.post('http://127.0.0.1:5000/api/admin/reset-messages')
        .then(response => {
          alert('Mensagens apagadas com sucesso!');
          fetchMessages(); // Atualiza a tabela na tela
        })
        .catch(err => {
          alert('Ocorreu um erro ao apagar as mensagens.');
          console.error(err);
        });
    }
  };

  // --- LÓGICA DA SENHA ---
  if (!isAuthenticated) {
    return (
        <div className="container" style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h2 className="page-title">Acesso Restrito</h2>
            <p>Por favor, insira a senha para acessar o painel.</p>
            <form onSubmit={handlePasswordSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowPassword(!showPassword)}>
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

  // --BLOCO MOSTRADO DEPOIS DE COLOCAR A SENHA CORRETA ---
  return (
    <div className="container">
      <h1 className="page-title">Painel do Administrador</h1>

      {/* Seção de Manutenção */}
      <div className="admin-section">
        <h2>Manutenção</h2>
        <p>Ações perigosas que afetam o banco de dados. Use com cuidado.</p>
        <div className="admin-actions">
          <button onClick={handleResetVotes} className="danger-button">Resetar Votos de Todos os Projetos</button>
          <button onClick={handleResetMessages} className="danger-button">Apagar Todas as Mensagens</button>
        </div>
      </div>
      
      {/* Seção de Mensagens */}
      <div className="admin-section">
        <h2>Mensagens Recebidas</h2>
        <table className="data-table">
            <thead><tr><th>Data</th><th>Nome</th><th>Email</th><th>Mensagem</th></tr></thead>
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
    </div>
  );
}

export default AdminPage;