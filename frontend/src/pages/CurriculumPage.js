import React from 'react';

// Estilos para a página de currículo, para melhorar a legibilidade
const curriculumStyle = {
  background: 'white',
  padding: '40px',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  lineHeight: '1.6'
};

const sectionTitleStyle = {
  marginBottom: '15px',
  marginTop: '10px'
};

// Estilo para a linha que separa as seções
const separatorStyle = {
    border: 'none',
    borderTop: '2px solid #ecf0f1',
    margin: '30px 0'
};

const personalInfoStyle = {
  textAlign: 'center',
  marginBottom: '0' // Ajustado para alinhar com a linha separadora
};


function CurriculumPage() {
  return (
    <div className="container">
      <h2 className="page-title">Currículo</h2>

      <div style={curriculumStyle}>
        {/* --- INÍCIO DO CURRÍCULO --- */}

        <div style={personalInfoStyle}>
          <h1>Marcelo Antony Accacio Olhier</h1>
          <p>
            Endereço: Rua Soldado PM Gilberto Augustinho, 237<br />
            Telefone: (11) 95314-1962 | E-mail: marceloaccacio9@gmail.com<br />
            Responsável: (11) 99997-6992 (Mãe)
          </p>
        </div>

        <hr style={separatorStyle} />

        <h3 style={sectionTitleStyle}>Objetivo</h3>
        <p>
          Busco minha primeira oportunidade profissional em uma empresa que valorize o aprendizado, o comprometimento e o desenvolvimento pessoal e técnico. Desejo aplicar meus conhecimentos adquiridos no curso técnico em Internet das Coisas (IoT), contribuindo com entusiasmo, dedicação e vontade de aprender para o sucesso da equipe e da organização.
        </p>

        <hr style={separatorStyle} />

        <h3 style={sectionTitleStyle}>Formação Acadêmica</h3>
        <p>
          Ensino Médio Técnico em Internet das Coisas (IoT)<br />
          Senac Nações Unidas - 02/2023 a 12/2025<br />
          Período: 13h00 às 18h15
        </p>
        
        <hr style={separatorStyle} />

        <h3 style={sectionTitleStyle}>Destaque Acadêmico</h3>
        <p>
          5º lugar no projeto Empreenda Senac, demonstrando espírito empreendedor, criatividade e capacidade de trabalho em equipe.
        </p>

        <hr style={separatorStyle} />

        <h3 style={sectionTitleStyle}>Curso Complementar</h3>
        <p>
          Gestão de Ameaças Cibernéticas - Senac<br />
          <em>(Conhecimentos sobre segurança digital, identificação de vulnerabilidades e prevenção de ataques cibernéticos)</em>
        </p>
        
        <hr style={separatorStyle} />

        <h3 style={sectionTitleStyle}>Competências e Perfil Profissional</h3>
        <ul>
          <li>Facilidade para aprender e absorver novas informações rapidamente.</li>
          <li>Colaboração e trabalho em equipe, prezando sempre pelo respeito e boa comunicação.</li>
          <li>Proatividade e comprometimento em todas as tarefas atribuídas.</li>
          <li>Grande interesse em tecnologia, inovação e segurança da informação.</li>
          <li>Dedicação em dar o melhor desempenho possível em cada desafio.</li>
        </ul>

        <hr style={separatorStyle} />

        <h3 style={sectionTitleStyle}>Experiência Profissional</h3>
        <p>
            Em busca da primeira oportunidade de trabalho. Desejo ingressar no mercado para adquirir experiência prática, colocar em uso meus conhecimentos técnicos e desenvolver novas habilidades que me ajudem a crescer profissionalmente.
        </p>

        <hr style={separatorStyle} />

        <h3 style={sectionTitleStyle}>Habilidades Técnicas</h3>
        <ul>
          <li>Conhecimentos em Internet das Coisas (IoT) e tecnologias emergentes.</li>
          <li>Noções de redes, sensores e conectividade de dispositivos inteligentes.</li>
          <li>Habilidade em resolução de problemas, lógica e raciocínio analítico.</li>
          <li>Capacidade de organização e responsabilidade com prazos e metas.</li>
        </ul>
        
        <hr style={separatorStyle} />
        
        <h3 style={sectionTitleStyle}>Idiomas</h3>
        <ul>
            <li>Português: Nativo</li>
        </ul>

        <hr style={separatorStyle} />

        <h3 style={sectionTitleStyle}>Informações Adicionais</h3>
        <ul>
          <li>Disponibilidade para aprender, colaborar e crescer dentro da empresa.</li>
          <li>Perfil dinâmico, curioso e com forte interesse em tecnologia e inovação.</li>
          <li>Aberto a novos desafios e sempre disposto a evoluir profissionalmente.</li>
        </ul>

      </div>

      <a 
        href="/documents/curriculo.pdf" 
        download="curriculo.pdf" 
        className="download-button"
      >
        Baixar Currículo (PDF)
      </a>
    </div>
  );
}

export default CurriculumPage;