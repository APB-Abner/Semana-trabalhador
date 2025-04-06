export default function LinhaDoTempo() {
    const eventos = [
        { ano: '1943', descricao: 'Criação da CLT – Consolidação das Leis do Trabalho no Brasil.' },
        { ano: '1988', descricao: 'Nova Constituição garante direitos ampliados aos trabalhadores.' },
        { ano: '1990s', descricao: 'Programas de estágio e jovem aprendiz ganham força.' },
        { ano: '2000', descricao: 'Lei da Aprendizagem é criada (Lei 10.097).' },
        { ano: '2014', descricao: 'Reformas no ensino médio fortalecem o ensino técnico.' },
        { ano: '2023', descricao: 'Debates sobre o futuro do trabalho e inclusão digital.' },
    ];

      return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📅 Linha do Tempo do Jovem Trabalhador</h2>
      <div className="relative mx-auto border-l-2 border-blue-500" style={{ maxWidth: '700px' }}>
        {eventos.map((evento, idx) => {
          const isRight = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`relative mb-10 flex ${isRight ? 'justify-start' : 'justify-end'} group`}
            >
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-2"></div>
              <div
                className={`max-w-md bg-white p-4 rounded-lg shadow-lg border border-blue-100 transition-transform duration-300 ease-in-out group-hover:scale-[1.02] ${isRight ? 'ml-6' : 'mr-6'}`}
              >
                <h3 className="text-xl font-semibold text-blue-600">{evento.ano}</h3>
                <p className="text-gray-700 mt-1">{evento.descricao}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
