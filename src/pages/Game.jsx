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
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">🎮 Desafio Jovem Trabalhador</h2>

            {fase === 'quiz' && <Quiz onComplete={irParaMemoria} />}
            {fase === 'memoria' && <Memoria onComplete={irParaResultado} />}
            {fase === 'resultado' && <Resultado reiniciar={reiniciarJogo} />}
        </div>
    );
}


// export default function Game() {
//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold">🎮 Desafio Final</h2>
//             <p className="mt-4 text-gray-700">Prepare-se para um mini game que vai testar seus conhecimentos sobre o mundo do trabalho!</p>
//             <div className="bg-gray-200 h-32 mt-4 rounded-md flex items-center justify-center">[Games em breve]</div>

//         </div>
//     );
// }
