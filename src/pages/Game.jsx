import { useState } from 'react';
import Continuar from '../components/game/Continuar';
import Memoria from '../components/game/Memoria';
import Quiz from '../components/game/Quiz';
import Resultado from '../components/game/Resultado';
import Badge from '../shared/ui/Badge.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

const fases = [
    { id: 'quiz', label: 'Quiz' },
    { id: 'continuar', label: 'Transição' },
    { id: 'memoria', label: 'Memória' },
    { id: 'resultado', label: 'Resultado' },
];

export default function Game() {
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
        <PageShell size="default">
            <PageHeader
                eyebrow="Game"
                title="Desafio Jovem Trabalhador"
                description="Responda ao quiz, avance para a memória e veja seu desempenho consolidado no final."
                align="center"
            />

            <div className="mx-auto mb-6 flex max-w-3xl flex-wrap justify-center gap-2">
                {fases.map((item) => (
                    <Badge key={item.id} tone={item.id === fase ? 'blue' : 'gray'}>
                        {item.label}
                    </Badge>
                ))}
            </div>

            <div className="mx-auto max-w-3xl">
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
            </div>
        </PageShell>
    );
}
