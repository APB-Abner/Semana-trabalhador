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
            <div className="relative mx-auto max-w-4xl">
                {/* Linha central */}
                <div className="absolute left-1/2 border-l-2 border-blue-500 transform -translate-x-1/2 top-0 z-0 h-full"></div>

                {/* Cards alternados */}
                <div className="flex flex-col gap-16">
                    {eventos.map((evento, idx) => {
                        const isRight = idx % 2 === 0;
                        return (
                            <div
                                key={idx}
                                className="relative flex items-start">
                                {/* Ponto central */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full z-10 top-2"></div>

                                {/* Card alinhado esquerda ou direita */}
                                <div className={`w-1/2 px-4 ${isRight ? 'ml-auto text-left' : 'mr-auto text-right'}`}>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-blue-100 dark:border-gray-700 transition-transform duration-300 ease-in-out group-hover:scale-105">
                                        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-300">{evento.ano}</h3>
                                        <p className="text-gray-700 dark:text-gray-300 mt-1">{evento.descricao}</p>
                                    </div>
                                </div>
                            </div>
                        );})}
                </div>
            </div>
        </div>
    );

}
