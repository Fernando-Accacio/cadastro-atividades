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

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/projects/ranked')
      .then(response => {
        setRankedProjects(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar o ranking!", error);
      });
  }, []);

  const hasVotes = rankedProjects.some(p => p.votes > 0);

  return (
    <div className="container">
      <h2 className="page-title">Ranking de Projetos</h2>
      <p style={{textAlign: 'center', marginBottom: '30px'}}>
        Projetos mais votados pela comunidade.
      </p>

      {!hasVotes ? (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
          Nenhum projeto votado ainda.
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
              const { className, medal } = hasVotes ? getRankDetails(index) : { className: '', medal: null };

              return (
                <tr key={project.id} className={className}>
                  {/* ADICIONE O 'data-label' AQUI */}
                  <td data-label="Posição">
                    {project.votes > 0 ? (
                      <>
                        {index + 1}º {medal && <span className="rank-medal">{medal}</span>}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  {/* E AQUI */}
                  <td data-label="Projeto" style={project.votes > 0 ? {} : {}}>
                    {project.name}
                  </td>
                  {/* E AQUI */}
                  <td data-label="Descrição">{project.description}</td>
                  {/* E AQUI */}
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