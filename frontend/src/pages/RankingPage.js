import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getRankDetails = (index) => {
  switch (index) {
    case 0:
      return { className: 'top-rank-1', medal: '🥇' };
    case 1:
      return { className: 'top-rank-2', medal: '🥈' };
    case 2:
      return { className: 'top-rank-3', medal: '🥉' };
    default:
      return { className: '', medal: null };
  }
};

function RankingPage() {
  const [rankedProjects, setRankedProjects] = useState([]);
  const [hasVotes, setHasVotes] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/projects/ranked')
      .then(response => {
        setHasVotes(response.data.hasVotes);
        setRankedProjects(response.data.projects);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar o ranking!", error);
      });
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">Ranking de Projetos</h2>
      <p style={{textAlign: 'center', marginBottom: '30px'}}>
        Projetos mais votados pela comunidade.
      </p>

      {!hasVotes ? (
        <p style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '40px' }}>
          Ainda não há votos registrados. Seja o primeiro a votar!
        </p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Posição</th>
              <th>Nome do Projeto</th>
              <th>Descrição</th>
              <th>Total de Votos</th>
            </tr>
          </thead>
          <tbody>
            {rankedProjects.map((project, index) => {
              const { className, medal } = getRankDetails(index);

              return (
                <tr key={project.id} className={className}>
                  <td data-label="Posição">
                    {index + 1}º
                    {medal && <span className="rank-medal">{medal}</span>}
                  </td>
                  <td data-label="Projeto">{project.name}</td>
                  <td data-label="Descrição">{project.description}</td>
                  <td data-label="Votos">{project.votes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RankingPage;