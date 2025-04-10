import { useState } from 'react';
import { somAcerto, somErro, somVitoria } from '../../sounds/sounds.js';

const perguntas = [
    {
        pergunta: 'Qual é a carga horária máxima para um jovem aprendiz por dia?',
        opcoes: ['8 horas', '6 horas', '4 horas', '10 horas'],
        resposta: '6 horas',
    },
    {
        pergunta: 'Jovens aprendizes têm direito a:',
        opcoes: [
            '13º salário e férias',
            'Apenas bolsa auxílio',
            'Vale-transporte apenas',
            'Nada, é voluntário',
        ],
        resposta: '13º salário e férias',
    },
    {
        pergunta: 'A partir de que idade é permitido ser jovem aprendiz no Brasil?',
        opcoes: ['12 anos', '14 anos', '16 anos', '18 anos'],
        resposta: '14 anos',
    },
    {
        pergunta: 'O contrato de aprendizagem pode durar no máximo:',
        opcoes: ['6 meses', '1 ano', '2 anos', '4 anos'],
        resposta: '2 anos',
    },
    {
        pergunta: 'A Lei da Aprendizagem foi criada em qual ano?',
        opcoes: ['1998', '2000', '2005', '2010'],
        resposta: '2000',
    },
    {
        pergunta: 'Jovem aprendiz tem direito a carteira assinada?',
        opcoes: ['Sim, desde o primeiro dia', 'Apenas após 6 meses', 'Não', 'Só se for CLT'],
        resposta: 'Sim, desde o primeiro dia',
    },
    {
        pergunta: 'É obrigatório que o jovem aprendiz esteja:',
        opcoes: ['No ensino médio ou em curso técnico', 'Empregado fixo', 'Disponível integralmente para o trabalho', 'Fazendo faculdade'],
        resposta: 'No ensino médio ou em curso técnico',
    },
    {
        pergunta: 'Durante o período de provas na escola, o jovem aprendiz:',
        opcoes: ['Pode faltar no trabalho sem justificativa', 'Tem direito à dispensa para estudar', 'Precisa trabalhar dobrado', 'Perde o contrato se faltar'],
        resposta: 'Tem direito à dispensa para estudar',
    },
    {
        pergunta: 'O contrato de aprendizagem combina trabalho com:',
        opcoes: ['Estudo teórico em instituição formadora', 'Estágio não remunerado', 'Voluntariado social', 'Serviço militar obrigatório'],
        resposta: 'Estudo teórico em instituição formadora',
    },
    {
        pergunta: 'Empresas de médio e grande porte são obrigadas a:',
        opcoes: ['Contratar entre 5% e 15% de aprendizes', 'Ter ao menos 1 jovem aprendiz', 'Oferecer cursos gratuitos', 'Pagar salários acima do mínimo'],
        resposta: 'Contratar entre 5% e 15% de aprendizes',
    },

];

export default function Quiz({ onComplete }) {
    const [indice, setIndice] = useState(0);
    const [acertos, setAcertos] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);

    const perguntaAtual = perguntas[indice];

    const selecionarResposta = (opcao) => {
        setRespostaSelecionada(opcao);

        if (opcao === perguntaAtual.resposta) {
            setAcertos(acertos + 1);
            somAcerto.play();
        } else {
            somErro.play();
        }

        setTimeout(() => {
            setRespostaSelecionada(null);

            if (indice + 1 < perguntas.length) {
                setIndice(indice + 1);
            } else {
                onComplete(acertos + (opcao === perguntaAtual.resposta ? 1 : 0));
                somVitoria.play();

            }
        }, 800);
    };

    return (
        <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
                {perguntaAtual.pergunta}
            </h3>
            <div className="grid gap-3">
                {perguntaAtual.opcoes.map((opcao, idx) => (
                    <button
                        key={idx}
                        className={`px-4 py-2 rounded border text-sm transition
              ${respostaSelecionada === null
                                ? 'bg-white hover:bg-blue-100'
                                : opcao === perguntaAtual.resposta
                                    ? 'bg-green-200 border-green-400'
                                    : opcao === respostaSelecionada
                                        ? 'bg-red-200 border-red-400'
                                        : 'bg-gray-100 border-gray-200'
                            }`}
                        onClick={() => selecionarResposta(opcao)}
                        disabled={respostaSelecionada !== null}
                    >
                        {opcao}
                    </button>
                ))}
            </div>
            <p className="mt-4 text-gray-500 text-sm">
                Pergunta {indice + 1} de {perguntas.length}
            </p>
        </div>
    );
}
