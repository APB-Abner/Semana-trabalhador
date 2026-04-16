import Badge from '../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../shared/ui/CtaButtonRow.jsx';
import ProgressBar from '../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../shared/ui/ResultPanel.jsx';

function avaliarPontuacao(total) {
    if (total >= 19) {
        return {
            rank: 'Mestre',
            tone: 'green',
            titulo: 'Jornada mestre',
            mensagem: 'Você combinou conhecimento, atenção e tomada de decisão com consistência.',
        };
    }

    if (total >= 15) {
        return {
            rank: 'Ouro',
            tone: 'blue',
            titulo: 'Jornada ouro',
            mensagem: 'Seu desempenho foi forte. Revise os poucos pontos fracos e tente bater seu recorde.',
        };
    }

    if (total >= 10) {
        return {
            rank: 'Prata',
            tone: 'purple',
            titulo: 'Jornada prata',
            mensagem: 'Você tem uma boa base e já reconhece muitos conceitos importantes.',
        };
    }

    return {
        rank: 'Bronze',
        tone: 'gray',
        titulo: 'Jornada bronze',
        mensagem: 'Use o replay para fortalecer os direitos do jovem aprendiz e treinar memória.',
    };
}

function principalForca(acertosQuiz, acertosMemoria) {
    if (acertosQuiz > acertosMemoria) {
        return 'Seu ponto mais forte foi o conhecimento sobre trabalho e aprendizagem.';
    }

    if (acertosMemoria > acertosQuiz) {
        return 'Seu ponto mais forte foi memória visual e atenção aos pares.';
    }

    return 'Seu resultado ficou equilibrado entre conhecimento e memória.';
}

export default function Resultado({ reiniciar, acertosQuiz, acertosMemoria }) {
    const total = acertosQuiz + acertosMemoria;
    const resultado = avaliarPontuacao(total);

    return (
        <ResultPanel className="animate-fade-in text-center">
            <div className="flex justify-center">
                <Badge tone={resultado.tone}>{resultado.rank}</Badge>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-gray-950 dark:text-white">
                {resultado.titulo}
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-gray-700 dark:text-gray-300">{resultado.mensagem}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                {principalForca(acertosQuiz, acertosMemoria)}
            </p>

            <div className="mt-7 grid gap-4 text-left sm:grid-cols-2">
                <ResultPanel>
                    <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <span>Quiz</span>
                        <span>{acertosQuiz} / 11</span>
                    </div>
                    <ProgressBar value={acertosQuiz} max={11} className="mt-3 h-2" />
                </ResultPanel>
                <ResultPanel>
                    <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <span>Memória</span>
                        <span>{acertosMemoria} / 10</span>
                    </div>
                    <ProgressBar value={acertosMemoria} max={10} className="mt-3 h-2" barClassName="bg-green-500" />
                </ResultPanel>
            </div>

            <p className="mt-7 text-2xl font-bold text-blue-600 dark:text-blue-300">
                Pontuação total: <strong>{total}</strong> / 21
            </p>

            <CtaButtonRow
                className="mt-6"
                actions={[
                    { label: 'Tentar novamente', onClick: reiniciar, tone: 'blue' },
                ]}
            />
        </ResultPanel>
    );
}
