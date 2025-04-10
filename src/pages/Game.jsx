// pages/Game.jsx
import { useState } from 'react';
import Quiz from '../components/game/Quiz';
import Memoria from '../components/game/Memoria';
import Resultado from '../components/game/Resultado';


export default function Game() {
    const [fase, setFase] = useState('quiz');

    const irParaMemoria = () => setFase('memoria');
    const irParaResultado = () => setFase('resultado');
    const reiniciarJogo = () => setFase('quiz');

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">🎮 Desafio Final</h2>

            {fase === 'quiz' && <Quiz onComplete={irParaMemoria} />}
            {fase === 'memoria' && <Memoria onComplete={irParaResultado} />}
            {fase === 'resultado' && <Resultado reiniciar={reiniciarJogo} />}
        </div>
    );
}
