import React from 'react';

const hobbiesData = [
  {
    title: 'Familia',
    image: 'images/familia.jpg',
    description: 'Minha base e meu maior orgulho. Estar com minha família é o que me recarrega de verdade — seja numa conversa tranquila, num almoço de domingo ou só compartilhando o dia a dia. São eles que me lembram sempre de onde vim e por que sigo em frente.'
  },
  {
    title: 'Namoro',
    image: '/images/namorada.jpg',
    description: 'Atualmente, divido a vida com minha namorada, Karol. Compartilhamos risadas, planos e muitos momentos especiais. É com ela que aprendo, cresço e descubro o valor das pequenas coisas que tornam a vida leve e cheia de sentido..'
  },
  {
    title: 'Jogos',
    image: '/images/fifa.jpg',
    description: 'Nos momentos de lazer, mergulho em outros universos pelos games. Gosto de competir no FIFA online, revisitar clássicos como Lego Indiana Jones e explorar novos mundos digitais. É uma forma de relaxar e manter a mente afiada — diversão com estratégia!'
  },
  {
    title: 'São Paulo Futebol Clube',
    image: '/images/spfc.jpg',
    description: 'Sou torcedor apaixonado pelo Tricolor Paulista! Futebol, pra mim, é emoção pura — cada jogo do São Paulo é uma montanha-russa de sentimentos. A paixão pelo time é daquelas que atravessa o tempo, mesmo nos altos e baixos.'
  }
];

function SobreMimPage() {
  return (
    <div className="container">
      <h2 className="page-title">Um Pouco Mais Sobre Mim</h2>

      <div className="informal-intro">
        <p>
          Fora do mundo dos códigos e circuitos, também tenho minhas paixões. Sempre estando ao lado de minha amada <strong>família</strong>. Atualmente, divido meu tempo com minha namorada, <strong>Karol</strong>, com quem gosto de compartilhar momentos. Quando o assunto é diversão, me conecto em outros universos através dos jogos eletrônicos, principalmente <strong>FIFA online, Lego Indiana Jones e outros</strong>. E, claro, como um bom brasileiro, o coração bate mais forte pelo futebol, especialmente quando o <strong>São Paulo Futebol Clube</strong> está em campo!
        </p>
      </div>

      <div className="hobbies-container">
        {hobbiesData.map((hobby, index) => (
          <div key={index} className="hobby-card">
            <img src={hobby.image} alt={hobby.title} className="hobby-image" />
            <div className="hobby-content">
              <h3>{hobby.title}</h3>
              <p>{hobby.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SobreMimPage;