import { useEffect, useState } from 'react';

const cartasBase = [
    '👨‍⚕️ Médico', '👨‍⚕️ Médico',
    '🧑‍🍳 Cozinheiro', '🧑‍🍳 Cozinheiro',
    '👩‍🏫 Professora', '👩‍🏫 Professora',
    '💻 Programador', '💻 Programador',
    '🧑‍🔧 Mecânico', '🧑‍🔧 Mecânico',
    '🎨 Designer', '🎨 Designer',
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

    useEffect(() => {
        if (selecionadas.length === 2) {
            const [a, b] = selecionadas;
            if (cartas[a] === cartas[b]) {
                setConcluidas((prev) => [...prev, a, b]);
                setSelecionadas([]);
            } else {
                setTimeout(() => setSelecionadas([]), 1000);
            }
        }
    }, [cartas, selecionadas]);

    useEffect(() => {
        if (concluidas.length === cartas.length && cartas.length > 0) {
            setTimeout(() => {
                onComplete(); // fim do jogo
            }, 1000);
        }
    }, [cartas.length, concluidas, onComplete]);

    const selecionar = (idx) => {
        if (
            selecionadas.includes(idx) ||
            concluidas.includes(idx) ||
            selecionadas.length === 2
        )
            return;
        setSelecionadas((prev) => [...prev, idx]);
    };

    return (
        <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
            {cartas.map((carta, idx) => {
                const revelada = selecionadas.includes(idx) || concluidas.includes(idx);
                return (
                    <div
                        key={idx}
                        onClick={() => selecionar(idx)}
                        className={`h-24 flex items-center justify-center rounded cursor-pointer transition-transform border-2 ${revelada ? 'bg-blue-100 border-blue-400' : 'bg-gray-200 border-gray-300'
                            }`}
                    >
                        {revelada ? <span className="text-lg">{carta}</span> : <span>❓</span>}
                    </div>
                );
            })}
        </div>
    );
}
