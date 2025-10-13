import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  return (
    <div className="container">
      <h2 className="page-title">Ranking de Projetos</h2>
      <p style={{textAlign: 'center', marginBottom: '30px'}}>Projetos mais votados pela comunidade.</p>
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
          {rankedProjects.map((project, index) => (
            <tr key={project.id}>
              <td>{index + 1}º</td>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{project.votes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RankingPage;