import Badge from '../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../shared/ui/CtaButtonRow.jsx';
import ProgressBar from '../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../shared/ui/ResultPanel.jsx';

function avaliarPontuacao(pontos) {
    if (pontos === 10) {
        return {
            rank: 'Mestre',
            tone: 'green',
            titulo: 'Quiz dominado',
            mensagem: 'Você acertou tudo e chega ao desafio de memória com vantagem máxima.',
        };
    }

    if (pontos >= 7) {
        return {
            rank: 'Forte',
            tone: 'blue',
            titulo: 'Bom domínio do conteúdo',
            mensagem: 'Você está no caminho certo. Agora vale manter o foco no jogo da memória.',
        };
    }

    if (pontos >= 4) {
        return {
            rank: 'Em evolução',
            tone: 'amber',
            titulo: 'Base em construção',
            mensagem: 'Você já reconhece pontos importantes, mas ainda tem espaço para revisar os direitos do aprendiz.',
        };
    }

    return {
        rank: 'Revisão',
        tone: 'red',
        titulo: 'Hora de reforçar',
        mensagem: 'Use a próxima etapa para recuperar pontos e depois tente o quiz novamente.',
    };
}

export default function Continuar({ pontuacao, reiniciar, continuar }) {
    const resultado = avaliarPontuacao(pontuacao);

    return (
        <ResultPanel className="animate-fade-in text-center">
            <div className="flex justify-center">
                <Badge tone={resultado.tone}>{resultado.rank}</Badge>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-gray-950 dark:text-white">
                {resultado.titulo}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-700 dark:text-gray-300">
                {resultado.mensagem}
            </p>

            <div className="mx-auto mt-6 max-w-md text-left">
                <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <span>Resultado do quiz</span>
                    <span>{pontuacao} / 11</span>
                </div>
                <ProgressBar value={pontuacao} max={11} className="mt-2 h-2" />
            </div>

            <CtaButtonRow
                className="mt-7"
                actions={[
                    { label: 'Tentar novamente', onClick: reiniciar, tone: 'gray' },
                    { label: 'Continuar', onClick: continuar, tone: 'blue' },
                ]}
            />
        </ResultPanel>
    );
}
