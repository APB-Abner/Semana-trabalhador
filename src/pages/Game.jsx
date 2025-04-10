// pages/Game.jsx
import { useState } from 'react';
import Quiz from '../components/game/Quiz';
import Memoria from '../components/game/Memoria';
import Resultado from '../components/game/Resultado';
import Continuar from '../components/game/Continuar';

export default function Game() {
    const [acertos, setAcertosQuiz] = useState(0);
    const [acertosMemoria, setAcertosMemoria] = useState(0);
    const [fase, setFase] = useState('quiz');

    const irParaMemoria = () => setFase('memoria');
    const irParaResultado = (pontuacaoMemoria) => {setFase('resultado'); setAcertosMemoria(pontuacaoMemoria)};
    const reiniciarJogo = () => { setAcertosQuiz(0); setAcertosMemoria(0); setFase('quiz');
    };
    const continuarJogo = (pontuacao) => { setFase('continuar'); setAcertosQuiz(pontuacao);};

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">🎮 Desafio Jovem Trabalhador</h2>

            {fase === 'quiz' && <Quiz onComplete={continuarJogo} />}
            {fase === 'continuar' && <Continuar reiniciar={reiniciarJogo} pontuacao={acertos} continuar={irParaMemoria}/>}
            {fase === 'memoria' && <Memoria onComplete={irParaResultado} />}
            {fase === 'resultado' && (
                <Resultado
                    reiniciar={reiniciarJogo}
                    acertosQuiz={acertos}
                    acertosMemoria={acertosMemoria}
                />
            )}

        </div>
    );
}

