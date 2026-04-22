import { useState } from 'react';
import Continuar from '../components/game/Continuar';
import Memoria from '../components/game/Memoria';
import Quiz from '../components/game/Quiz';
import Resultado from '../components/game/Resultado';
import CanOrCantGame from '../features/games/can-or-cant/CanOrCantGame.jsx';
import FindTheMistakeGame from '../features/games/find-the-mistake/FindTheMistakeGame.jsx';
import ProfessionalCommunicationGame from '../features/games/professional-communication/ProfessionalCommunicationGame.jsx';
import Badge from '../shared/ui/Badge.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

const fases = [
    { id: 'quiz', label: 'Quiz' },
    { id: 'continuar', label: 'Transição' },
    { id: 'memoria', label: 'Memória' },
    { id: 'resultado', label: 'Resultado' },
];

const gameModes = [
    {
        id: 'original',
        eyebrow: 'Clássico',
        title: 'Modo original',
        description: 'Quiz de direitos e jogo da memória em sequência.',
        accent: 'blue',
    },
    {
        id: 'can-or-cant',
        eyebrow: 'Postura',
        title: 'Pode / Não Pode',
        description: 'Classifique atitudes comuns do trabalho e veja o motivo.',
        accent: 'green',
    },
    {
        id: 'communication',
        eyebrow: 'Comunicação',
        title: 'Comunicação Profissional',
        description: 'Escolha a melhor resposta em situações de rotina.',
        accent: 'purple',
    },
    {
        id: 'find-mistake',
        eyebrow: 'Atenção',
        title: 'Caça-erros',
        description: 'Marque problemas em mensagens, currículos e atitudes.',
        accent: 'amber',
    },
];

function modeCardClass(isActive) {
    return isActive
        ? 'border-blue-500 bg-blue-50 text-blue-950 shadow-sm dark:border-blue-500 dark:bg-blue-950/70 dark:text-white'
        : 'border-gray-200 bg-white text-gray-950 hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-blue-700 dark:hover:bg-blue-950/40';
}

function OriginalJourney() {
    const [acertos, setAcertosQuiz] = useState(0);
    const [acertosMemoria, setAcertosMemoria] = useState(0);
    const [fase, setFase] = useState('quiz');

    const irParaMemoria = () => setFase('memoria');
    const irParaResultado = (pontuacaoMemoria) => {
        setFase('resultado');
        setAcertosMemoria(pontuacaoMemoria);
    };
    const reiniciarJogo = () => {
        setAcertosQuiz(0);
        setAcertosMemoria(0);
        setFase('quiz');
    };
    const continuarJogo = (pontuacao) => {
        setFase('continuar');
        setAcertosQuiz(pontuacao);
    };

    return (
        <>
            <div className="mx-auto mb-6 flex max-w-3xl flex-wrap justify-center gap-2">
                {fases.map((item) => (
                    <Badge key={item.id} tone={item.id === fase ? 'blue' : 'gray'}>
                        {item.label}
                    </Badge>
                ))}
            </div>

            {fase === 'quiz' && <Quiz onComplete={continuarJogo} />}
            {fase === 'continuar' && <Continuar reiniciar={reiniciarJogo} pontuacao={acertos} continuar={irParaMemoria} />}
            {fase === 'memoria' && <Memoria onComplete={irParaResultado} />}
            {fase === 'resultado' && (
                <Resultado
                    reiniciar={reiniciarJogo}
                    acertosQuiz={acertos}
                    acertosMemoria={acertosMemoria}
                />
            )}
        </>
    );
}

export default function Game() {
    const [activeMode, setActiveMode] = useState('original');
    const backToOriginal = () => setActiveMode('original');

    return (
        <PageShell size="wide">
            <PageHeader
                eyebrow="Game"
                title="Desafio Jovem Trabalhador"
                description="Escolha um modo rápido para treinar conhecimento, postura, comunicação e atenção profissional."
                align="center"
            />

            <div className="mb-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {gameModes.map((mode) => {
                    const isActive = activeMode === mode.id;

                    return (
                        <button
                            key={mode.id}
                            type="button"
                            onClick={() => setActiveMode(mode.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 ${modeCardClass(isActive)}`}
                        >
                            <Badge tone={mode.accent}>{mode.eyebrow}</Badge>
                            <h2 className="mt-4 text-lg font-bold">{mode.title}</h2>
                            <p className="mt-2 text-sm leading-6 opacity-80">{mode.description}</p>
                        </button>
                    );
                })}
            </div>

            <div key={activeMode} className="mx-auto max-w-4xl">
                {activeMode === 'original' && <OriginalJourney />}
                {activeMode === 'can-or-cant' && <CanOrCantGame onBackToMenu={backToOriginal} />}
                {activeMode === 'communication' && <ProfessionalCommunicationGame onBackToMenu={backToOriginal} />}
                {activeMode === 'find-mistake' && <FindTheMistakeGame onBackToMenu={backToOriginal} />}
            </div>
        </PageShell>
    );
}
