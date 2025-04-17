import Carousel from '../components/Carocel.jsx';


export default function Historias   () {
    return (
        <div className="p-6 max-w-3xl mx-auto text-gray-800">
            <h1 className="text-4xl font-bold mb-6 text-center">📅 Dia do Trabalho no Brasil</h1>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">1. Introdução</h2>
                <p>
                    O Dia do Trabalho, também chamado de Dia do Trabalhador, é comemorado em <strong>1º de maio</strong>.
                    A data é reconhecida no mundo todo como um marco das lutas trabalhistas por melhores condições de trabalho e direitos sociais.
                    No Brasil, além de ser feriado, a data tem uma história ligada às transformações políticas e sociais do século XX.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">2. Origem do 1º de Maio (Contexto Internacional)</h2>
                <p>
                    O 1º de maio foi escolhido em homenagem à <strong>Greve de Chicago</strong>, nos Estados Unidos, em 1886,
                    onde milhares de trabalhadores protestaram exigindo a <strong>redução da jornada para 8 horas</strong> diárias.
                    A manifestação foi brutalmente reprimida, resultando em mortes e prisões.
                    Em 1889, o Congresso Socialista de Paris escolheu o 1º de maio como símbolo mundial da luta dos trabalhadores.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">3. Chegada do 1º de Maio ao Brasil</h2>
                <p>
                    A data começou a ser lembrada no Brasil no final do século XIX, principalmente entre <strong>trabalhadores imigrantes</strong>
                    influenciados pelas ideias socialistas e anarquistas. As primeiras celebrações foram marcadas por greves e manifestações
                    em cidades como São Paulo e Rio de Janeiro, exigindo <strong>melhores salários, redução de jornada e condições dignas</strong>.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">4. Reconhecimento Oficial</h2>
                <p>
                    O feriado foi <strong>oficializado em 1925</strong> pelo presidente Artur Bernardes, mas ganhou força mesmo na <strong>Era Vargas</strong>,
                    nos anos 1930.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">5. Era Vargas e o Uso Político da Data</h2>
                <p>
                    Getúlio Vargas usou o 1º de maio para <strong>reforçar sua imagem de aliado dos trabalhadores</strong>.
                    Foi nessa data, em <strong>1943</strong>, que ele anunciou a criação da <strong>CLT (Consolidação das Leis do Trabalho)</strong>,
                    garantindo direitos como férias, jornada regulada e carteira assinada. A data passou a ser marcada por anúncios de novas leis,
                    festas públicas e discursos.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">6. Conclusão</h2>
                <p>
                    O Dia do Trabalho representa não só as <strong>lutas por direitos</strong>, mas também como o <strong>Estado brasileiro</strong>
                    utilizou essa data para construir uma relação simbólica com os trabalhadores.
                    Ele conecta o Brasil a uma luta global, mas com características próprias, marcadas pelo <strong>populismo e pela institucionalização</strong>
                    na Era Vargas.
                </p>
            </section>

            <section className="mb-6 border-t pt-6">
                <h2 className="text-xl font-semibold mb-2">📌 Curiosidade</h2>
                <Carousel />
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-2">🔁 O que você gostaria de fazer agora?</h2>
                <div className="flex gap-4 flex-wrap">
                    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        Voltar ao topo
                    </button>
                    <button type="button" onClick={() => alert('Essa função será implementada em breve.')}>Ir para Quiz</button>
                    <button type="button" onClick={() => alert('Essa função será implementada em breve.')}>Voltar para o Jogo</button>
                </div>
            </section>
        </div>
    );
}
