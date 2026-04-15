import { timelineEvents } from '../content/timeline/events.js';

export default function LinhaDoTempo() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">📅 Linha do Tempo do Jovem Trabalhador</h2>
            <div className="relative mx-auto max-w-4xl">
                {/* Linha central */}
                <div className="absolute left-1/2 border-l-2 border-blue-500 transform -translate-x-1/2 top-0 z-0 h-full"></div>

                {/* Cards alternados */}
                <div className="flex flex-col gap-16">
                    {timelineEvents.map((evento, idx) => {
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
