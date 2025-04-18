import { useState, useEffect, useCallback } from 'react';
import { somAcerto, somErro, somVitoria } from '../../sounds/sounds.js';

const perguntasBase = [
    {
        pergunta: 'Qual é a carga horária máxima para um jovem aprendiz por dia?',
        opcoes: ['8 horas', '6 horas', '4 horas', '10 horas'],
        resposta: '8 horas',
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
        opcoes: ['Sim, desde o primeiro dia como CLT', 'Apenas após 6 meses', 'Não', 'Só após 2 anos'],
        resposta: 'Sim, desde o primeiro dia como CLT',
    },
    {
        pergunta: 'É obrigatório que o jovem aprendiz esteja:',
        opcoes: ['Cursando ou concluído o ensino médio, ou curso técnico', 'Empregado fixo', 'Disponível integralmente para o trabalho', 'Fazendo faculdade'],
        resposta: 'Cursando ou concluído o ensino médio, ou curso técnico',
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
    {
        pergunta: 'Qual é o número da Lei da Aprendizagem que regulamenta a contratação de jovens aprendizes no Brasil?',
        opcoes: ['Lei nº 10.097 / 2000', 'Lei nº 8.666 / 1993', 'Lei nº 11.494 / 2007', 'Lei nº 9.394 / 1996'],
        resposta: 'Lei nº 10.097 / 2000',
    },

];


function embaralharArray(array) {
    return array
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
}

export default function Quiz({ onComplete }) {
    const [perguntas, setPerguntas] = useState([]);
    const [indice, setIndice] = useState(0);
    const [acertos, setAcertos] = useState(0);
    const [tecladoAtivo, setTecladoAtivo] = useState(false);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [opcaoSelecionadaIndex, setOpcaoSelecionadaIndex] = useState(0);

    // ✅ useEffect deve vir antes de qualquer return
    useEffect(() => {
        const perguntasEmbaralhadas = embaralharArray(
            perguntasBase.map((p) => ({
                ...p,
                opcoes: embaralharArray([...p.opcoes]),
            }))
        );
        setPerguntas(perguntasEmbaralhadas);
    }, []);

    // ⚠️ useCallback também antes do return
    const selecionarResposta = useCallback((opcao) => {
        if (respostaSelecionada !== null) return;

        setRespostaSelecionada(opcao);
        const acertou = opcao === perguntas[indice].resposta;

        if (acertou) {
            setAcertos((prev) => prev + 1);
            somAcerto.play();
        } else {
            somErro.play();
        }

        setTimeout(() => {
            setRespostaSelecionada(null);
            setOpcaoSelecionadaIndex(0);

            if (indice + 1 < perguntas.length) {
                setIndice(indice + 1);
            } else {
                onComplete(acertos + (acertou ? 1 : 0));
                somVitoria.play();
            }
        }, 800);
    }, [respostaSelecionada, perguntas, indice, acertos, onComplete]);

    // ✅ teclado também aqui antes do return
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (respostaSelecionada !== null || !perguntas.length) return;

            const perguntaAtual = perguntas[indice];

            // Ativa controle de teclado só na primeira tecla de navegação
            if (!tecladoAtivo && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                setTecladoAtivo(true);
                return; // não move ainda, só ativa o controle
            }

            if (!tecladoAtivo) return;

            if (e.key === 'ArrowUp') {
                setOpcaoSelecionadaIndex((prev) =>
                    prev > 0 ? prev - 1 : perguntaAtual.opcoes.length - 1
                );
            }

            if (e.key === 'ArrowDown') {
                setOpcaoSelecionadaIndex((prev) =>
                    prev < perguntaAtual.opcoes.length - 1 ? prev + 1 : 0
                );
            }

            if (e.key === 'Enter') {
                selecionarResposta(perguntaAtual.opcoes[opcaoSelecionadaIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [respostaSelecionada, perguntas, indice, opcaoSelecionadaIndex, tecladoAtivo, selecionarResposta]);


    // ✅ Agora o return condicional está DEPOIS dos hooks
    if (!perguntas.length) {
        return (
            <div className="max-w-xl mx-auto text-center">
                <p className="text-gray-600">Carregando perguntas...</p>
            </div>
        );
    }

    const perguntaAtual = perguntas[indice];
    const progresso = ((indice + 1) / perguntas.length) * 100;

    return (
        <div className="max-w-xl mx-auto text-center text-gray-900 dark:text-white">
            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-3 rounded mb-4 overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${progresso}%` }}
                />
            </div>

            {/* Pergunta */}
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                {perguntaAtual.pergunta}
            </h3>

            {/* Opções */}
            <div className="grid gap-3">
                {perguntaAtual.opcoes.map((opcao, idx) => {
                    const isSelecionada = respostaSelecionada !== null;
                    const isCorreta = opcao === perguntaAtual.resposta;
                    const isErrada = opcao === respostaSelecionada && !isCorreta;
                    const isFocus = tecladoAtivo && idx === opcaoSelecionadaIndex && !isSelecionada;

                    let bgClass = 'bg-white dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900 border';
                    if (isCorreta && isSelecionada) bgClass = 'bg-green-200 border-green-400 dark:bg-green-600';
                    else if (isErrada && isSelecionada) bgClass = 'bg-red-200 border-red-400 dark:bg-red-600';
                    else if (isFocus) bgClass = 'bg-blue-100 border-blue-300 dark:bg-blue-800';

                    return (
                        <button
                            key={idx}
                            onClick={() => selecionarResposta(opcao)}
                            disabled={isSelecionada}
                            className={`px-4 py-2 rounded text-sm transition-all duration-300 ${bgClass}`}
                        >
                            {opcao}
                        </button>
                    );
                })}
            </div>

            {/* Rodapé da pergunta */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                <span>Pergunta {indice + 1} de {perguntas.length}</span>
                <span>Acertos: {acertos}</span>
            </div>
        </div>
    );
}
