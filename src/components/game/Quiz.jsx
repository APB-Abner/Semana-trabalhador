import { useState, useEffect } from 'react';

const perguntas = [
    {
        pergunta: 'Você prefere trabalhar com ideias ou com pessoas?',
        opcoes: ['Ideias', 'Pessoas'],
        correta: 'Ideias',
    },
    {
        pergunta: 'Você gosta de seguir rotinas ou resolver problemas novos?',
        opcoes: ['Rotinas', 'Problemas novos'],
        correta: 'Problemas novos',
    },
    {
        pergunta: 'Prefere ambientes organizados ou criativos?',
        opcoes: ['Organizados', 'Criativos'],
        correta: 'Criativos',
    },
    {
        pergunta: 'Você se sente mais confortável em tarefas práticas ou teóricas?',
        opcoes: ['Práticas', 'Teóricas'],
        correta: 'Práticas',
    },
    {
        pergunta: 'Você prefere trabalhar sozinho ou em equipe?',
        opcoes: ['Sozinho', 'Em equipe'],
        correta: 'Em equipe',
    },
];

export default function Quiz({ onComplete }) {
    const [etapa, setEtapa] = useState(0);
    const [tempo, setTempo] = useState(20);
    const [pontos, setPontos] = useState(0);

    useEffect(() => {
        if (etapa < perguntas.length) {
            const timer = setInterval(() => {
                setTempo((t) => {
                    if (t === 1) {
                        clearInterval(timer);
                        setEtapa(etapa + 1);
                        setTempo(20);
                        return 20;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [etapa]);

    const responder = (resposta) => {
        const correta = perguntas[etapa].correta;
        let ganho = 0;
        if (resposta === correta) {
            ganho += 10;
            if (tempo >= 10) ganho += 5;
        }
        setPontos((p) => p + ganho);
        setEtapa((e) => e + 1);
        setTempo(20);
    };

    if (etapa >= perguntas.length) {
        return (
            <div className="text-center">
                <p className="text-lg mb-4">Você fez {pontos} pontos no Quiz!</p>
                <button
                    onClick={() => onComplete(pontos)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Ir para a próxima fase
                </button>
            </div>
        );
    }

    const atual = perguntas[etapa];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Pergunta {etapa + 1} de {perguntas.length}</h3>
                <span className="text-red-600 font-bold">{tempo}s</span>
            </div>
            <p className="text-gray-800">{atual.pergunta}</p>
            <div className="flex flex-col gap-4">
                {atual.opcoes.map((op, i) => (
                    <button
                        key={i}
                        onClick={() => responder(op)}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                        {op}
                    </button>
                ))}
            </div>
        </div>
    );
}
