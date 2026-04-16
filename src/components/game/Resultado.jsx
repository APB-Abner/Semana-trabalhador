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
            mensagem: 'VocÃª combinou conhecimento, atenÃ§Ã£o e tomada de decisÃ£o com consistÃªncia.',
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
            mensagem: 'VocÃª tem uma base boa e jÃ¡ consegue reconhecer muitos conceitos importantes.',
        };
    }

    return {
        rank: 'Bronze',
        tone: 'gray',
        titulo: 'Jornada bronze',
        mensagem: 'Use o replay para fortalecer os direitos do jovem aprendiz e treinar memÃ³ria.',
    };
}

function principalForca(acertosQuiz, acertosMemoria) {
    if (acertosQuiz > acertosMemoria) {
        return 'Seu ponto mais forte foi o conhecimento sobre trabalho e aprendizagem.';
    }

    if (acertosMemoria > acertosQuiz) {
        return 'Seu ponto mais forte foi memÃ³ria visual e atenÃ§Ã£o aos pares.';
    }

    return 'Seu resultado ficou equilibrado entre conhecimento e memÃ³ria.';
}

export default function Resultado({ reiniciar, acertosQuiz, acertosMemoria }) {
    const total = acertosQuiz + acertosMemoria;
    const resultado = avaliarPontuacao(total);

    return (
        <div className="text-center p-6 max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow animate-fade-in">
            <div className="flex justify-center">
                <Badge tone={resultado.tone}>{resultado.rank}</Badge>
            </div>

            <h2 className="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-300">
                {resultado.titulo}
            </h2>

            <p className="mt-3 text-gray-700 dark:text-gray-300">{resultado.mensagem}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{principalForca(acertosQuiz, acertosMemoria)}</p>

            <ResultPanel className="mt-6 text-left">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <span>Quiz</span>
                            <span>{acertosQuiz} / 11</span>
                        </div>
                        <ProgressBar value={acertosQuiz} max={11} className="mt-2 h-2" />
                    </div>
                    <div>
                        <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <span>MemÃ³ria</span>
                            <span>{acertosMemoria} / 10</span>
                        </div>
                        <ProgressBar value={acertosMemoria} max={10} className="mt-2 h-2" barClassName="bg-green-500" />
                    </div>
                </div>
            </ResultPanel>

            <p className="mt-6 text-xl font-semibold text-blue-600 dark:text-blue-400">
                PontuaÃ§Ã£o total: <strong>{total}</strong> / 21
            </p>

            <CtaButtonRow
                className="mt-6"
                actions={[
                    { label: 'Tentar novamente', onClick: reiniciar, tone: 'blue' },
                ]}
            />
        </div>
    );
}
