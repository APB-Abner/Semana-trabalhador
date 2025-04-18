import { useEffect, useState, useRef } from 'react';

const cartasBase = [
    '🧑‍💼 Assistente Administrativo', '🧑‍💼 Assistente Administrativo',
    '🧑‍🍳 Auxiliar de Cozinha', '🧑‍🍳 Auxiliar de Cozinha',
    '👨‍💻 Suporte Técnico', '👨‍💻 Suporte Técnico',
    '🧑‍🔧 Auxiliar de Manutenção', '🧑‍🔧 Auxiliar de Manutenção',
    '📦 Estoquista', '📦 Estoquista',
    '💬 Atendente de SAC', '💬 Atendente de SAC',
];

function embaralhar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

export default function Memoria({ onComplete }) {
    const [cartas] = useState(() => embaralhar(cartasBase));
    const [selecionadas, setSelecionadas] = useState([]);
    const [concluidas, setConcluidas] = useState([]);
    const [tempoRestante, setTempoRestante] = useState(60);
    const timerRef = useRef(null);

    const somAcerto = useRef(null);
    const somErro = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTempoRestante((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    finalizarJogo();
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (selecionadas.length === 2) {
            const [a, b] = selecionadas;
            if (cartas[a] === cartas[b]) {
                somAcerto.current?.play();
                setConcluidas((prev) => [...prev, a, b]);
                setSelecionadas([]);
            } else {
                somErro.current?.play();
                setTimeout(() => setSelecionadas([]), 1000);
            }
        }
    }, [selecionadas, cartas]);

    useEffect(() => {
        if (concluidas.length === cartas.length && cartas.length > 0) {
            clearInterval(timerRef.current);
            finalizarJogo();
        }
    }, [concluidas]);

    const selecionar = (idx) => {
        if (
            selecionadas.includes(idx) ||
            concluidas.includes(idx) ||
            selecionadas.length === 2
        )
            return;
        setSelecionadas((prev) => [...prev, idx]);
    };

    const finalizarJogo = () => {
        const pontuacao = Math.round((concluidas.length / cartas.length) * 10);
        onComplete(pontuacao);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="flex justify-between items-center mb-4 text-lg font-medium">
                <span>⏱️ Tempo: {tempoRestante}s</span>
                <span>✅ Pares: {concluidas.length / 2}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {cartas.map((carta, idx) => {
                    const revelada = selecionadas.includes(idx) || concluidas.includes(idx);
                    return (
                        <div
                            key={idx}
                            onClick={() => selecionar(idx)}
                            className={`
                                h-24 sm:h-28 flex items-center justify-center 
                                rounded-lg cursor-pointer transition-transform 
                                duration-300 transform hover:scale-105 select-none
                                border-2 text-sm text-center font-semibold px-1
                                ${revelada
                                    ? 'bg-blue-100 border-blue-400 text-blue-800'
                                    : 'bg-gray-200 border-gray-300 text-gray-500'}
                            `}
                        >
                            {revelada ? carta : '❓'}
                        </div>
                    );
                })}
            </div>

            {/* Áudios */}
            <audio ref={somAcerto} src="/sons/acerto.mp3" preload="auto" />
            <audio ref={somErro} src="/sons/erro.mp3" preload="auto" />
        </div>
    );
}
