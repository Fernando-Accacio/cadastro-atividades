import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Importa o axios configurado

function SobreMimPage() {
  // 1. Criar estado para hobbies e loading
  const [hobbies, setHobbies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Buscar dados da API quando o componente carregar
  useEffect(() => {
    setIsLoading(true);
    api.get('/api/hobbies') // Rota pública que criamos
      .then(response => {
        setHobbies(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar hobbies:", error);
        setIsLoading(false);
      });
  }, []); // O array vazio [] garante que isso rode só uma vez

  // Função para pegar as iniciais (para o placeholder)
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container">
      <h2 className="page-title">Um Pouco Mais Sobre Mim</h2>

      {/* O seu texto de introdução (mantido) */}
      <div className="informal-intro">
        <p>
          Fora do mundo dos códigos e circuitos, também tenho minhas paixões. Sempre estando ao lado de minha amada <strong>família</strong>. Atualmente, divido meu tempo com minha namorada, <strong>Karol</strong>, com quem gosto de compartilhar momentos. Quando o assunto é diversão, me conecto em outros universos através dos jogos eletrônicos, principalmente <strong>FIFA online, Lego Indiana Jones e outros</strong>. E, claro, como um bom brasileiro, o coração bate mais forte pelo futebol, especialmente quando o <strong>São Paulo Futebol Clube</strong> está em campo!
        </p>
      </div>

      {/* 3. Mapear os dados do estado (hobbies) */}
      <div className="hobbies-container">
        {isLoading ? (
          <p style={{textAlign: 'center', fontStyle: 'italic', fontSize: '1.1rem'}}>Carregando hobbies...</p>
        ) : hobbies.length === 0 ? (
          <div className="informal-intro" style={{backgroundColor: '#ffffffff'}}>
            <p style={{margin: 0, color: '#d13737ff'}}>Ainda não cadastrei meus hobbies. Volte mais tarde!</p>
          </div>
        ) : (
          hobbies.map((hobby) => (
            <div key={hobby.id} className="hobby-card">
              {/* Usar a imagem da API, com um placeholder se não houver */}
              {hobby.image_url ? (
                 <img src={hobby.image_url} alt={hobby.title} className="hobby-image" />
              ) : (
                <div className="hobby-image" style={{
                    width: '40%', // Presume o estilo de desktop
                    height: '300px',
                    flexShrink: 0,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: '#e9ecef', 
                    color: '#adb5bd'
                  }}>
                  <span style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{getInitials(hobby.title)}</span>
                </div>
              )}
             
              <div className="hobby-content">
                <h3>{hobby.title}</h3>
                <p>{hobby.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SobreMimPage;