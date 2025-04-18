import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti'; 
import { somAcerto, somErro, somVitoria } from '../../sounds/sounds.js';



const cartasBase = [
    '📦 Estoquista', '📦 Estoquista',
    '💬 Atendente de SAC', '💬 Atendente de SAC',
    '🧑‍💼 Assistente Administrativo', '🧑‍💼 Assistente Administrativo',
    '🧑‍🍳 Auxiliar de Cozinha', '🧑‍🍳 Auxiliar de Cozinha',
    '👨‍💻 Suporte Técnico', '👨‍💻 Suporte Técnico',
    '🧑‍🔧 Auxiliar de Manutenção', '🧑‍🔧 Auxiliar de Manutenção',
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

    // Timer regressivo
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTempoRestante((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    finalizarJogo();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    // Checa combinação
    useEffect(() => {
        if (selecionadas.length === 2) {
            const [a, b] = selecionadas;
            if (cartas[a] === cartas[b]) {
                somAcerto.play();
                setConcluidas((prev) => [...prev, a, b]);
                setSelecionadas([]);
            } else {
                somErro.play();
                setTimeout(() => setSelecionadas([]), 800);
            }
        }
    }, [selecionadas, cartas]);

    // Finaliza quando completa
    useEffect(() => {
        if (concluidas.length === cartas.length) {
            clearInterval(timerRef.current);
            setTimeout(() => {
                confetti();
                finalizarJogo();
            }, 500);
        }
    }, [concluidas, cartas.length]);

    const selecionar = (idx) => {
        if (selecionadas.includes(idx) || concluidas.includes(idx) || selecionadas.length === 2) return;
        setSelecionadas((prev) => [...prev, idx]);
    };

    const finalizarJogo = () => {
        const pont = Math.round((concluidas.length / cartas.length) * 10);
        somVitoria.play();
        onComplete(pont);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            {/* Barra de tempo */}
            <div className={`w-full h-3 mb-3 rounded ${tempoRestante <= 10 ? 'bg-red-500' : 'bg-green-500'} transition-colors duration-300`}>
                <div className="h-full bg-blue-500" style={{ width: `${(tempoRestante / 60) * 100}%` }} />
            </div>
            <div className="flex justify-between items-center text-sm mb-4">
                <span>⏱️ {tempoRestante}s</span>
                <span>✅ Pares: {concluidas.length / 2}</span>
            </div>
            {/* Grid de cartas */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {cartas.map((carta, idx) => {
                    const revelada = selecionadas.includes(idx) || concluidas.includes(idx);
                    return (
                        <div
                            key={idx}
                            onClick={() => selecionar(idx)}
                            className="relative w-full h-28 perspective cursor-pointer"
                        >
                            <div className={`w-full h-full transition-transform duration-500 preserve-3d ${revelada ? 'rotate-y-180' : ''}`}>
                                {/* Frente */}
                                <div className="absolute w-full h-full backface-hidden bg-gray-200 dark:bg-zinc-700 border-2 border-gray-300 dark:border-zinc-600 rounded-lg flex items-center justify-center text-2xl text-gray-500 dark:text-gray-400">
                                    ❓
                                </div>
                                {/* Verso */}
                                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 dark:border-blue-700 rounded-lg flex items-center justify-center text-sm font-semibold text-blue-800 dark:text-blue-200 px-1 text-center">
                                    {carta}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}