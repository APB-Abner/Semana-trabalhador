import { useState } from 'react';
import Quiz from '../components/game/Quiz';
import Memoria from '../components/game/Memoria';
import Resultado from '../components/game/Resultado';
import Continuar from '../components/game/Continuar';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

export default function Game() {
    const [acertos, setAcertosQuiz] = useState(0);
    const [acertosMemoria, setAcertosMemoria] = useState(0);
    const [fase, setFase] = useState('quiz');

    const irParaMemoria = () => setFase('memoria');
    const irParaResultado = (pontuacaoMemoria) => { setFase('resultado'); setAcertosMemoria(pontuacaoMemoria); };
    const reiniciarJogo = () => { setAcertosQuiz(0); setAcertosMemoria(0); setFase('quiz'); };
    const continuarJogo = (pontuacao) => { setFase('continuar'); setAcertosQuiz(pontuacao); };

    return (
        <PageShell size="default">
            <PageHeader
                eyebrow="Game"
                title="Desafio Jovem Trabalhador"
                description="Responda ao quiz, avance para a memória e veja seu resultado consolidado no final."
                className="mx-auto text-center"
            />

            <div className="mx-auto max-w-xl">
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
