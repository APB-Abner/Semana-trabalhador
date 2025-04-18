
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import LinhaDoTempo from '../components/LinhaDoTempo';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const containerRef = useRef(null);

    useEffect(() => {
        const sections = containerRef.current.querySelectorAll('.section');
        sections.forEach((section, i) => {
            gsap.fromTo(
                section,
                { opacity: 0, y: 50 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: i * 0.2
                }
            );
        });
    }, []);

    return (
        <div ref={containerRef} className="p-6 space-y-20 bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
            <section className="section text-center">
                <h2 className="text-3xl font-bold">Bem-vindo à Semana do Jovem Trabalhador</h2>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Celebre conquistas, descubra oportunidades e trilhe novos caminhos!
                </p>
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">📅 Linha do Tempo</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Acompanhe a evolução dos direitos e oportunidades dos jovens no mercado de trabalho.
                </p>
                <LinhaDoTempo />
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">💡 Dicas e Inspirações</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Receba conselhos práticos, histórias inspiradoras e estratégias para avançar na sua carreira.
                    Conheça dicas valiosas para o seu desenvolvimento profissional.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
                        <img src="/path/to/image1.jpg" alt="Linha do Tempo" className="w-full h-40 object-cover rounded-t-lg" />
                        <h4 className="mt-4 text-lg font-medium">Contexto Histórico</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Conheça a evolução dos direitos e oportunidades dos jovens no mercado de trabalho,
                            com uma linha do tempo detalhada e cheia de marcos importantes.
                        </p>
                        <Link
                            to="/historias"
                            className="inline-block mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            Ir Para Histórias
                        </Link>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
                        <img src="/path/to/image2.jpg" alt="Dicas" className="w-full h-40 object-cover rounded-t-lg" />
                        <h4 className="mt-4 text-lg font-medium">Dicas Práticas</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Explore dicas e orientações práticas para desenvolver suas habilidades e avançar na sua carreira.
                            Prepare-se para os desafios do mercado de trabalho com confiança.
                        </p>
                        <Link
                            to="/dicas"
                            className="inline-block mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            Ir Para Dicas
                        </Link>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
                        <img src="/path/to/image3.jpg" alt="Teste Rápido" className="w-full h-40 object-cover rounded-t-lg" />
                        <h4 className="mt-4 text-lg font-medium">Teste de Aptidão</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Descubra seu perfil de trabalhador com este teste rápido e entenda melhor seus pontos fortes e áreas de crescimento.
                        </p>
                        <Link
                            to="/testes"
                            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Fazer o Teste
                        </Link>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
                        <img src="/path/to/image4.jpg" alt="Mapa de Oportunidades" className="w-full h-40 object-cover rounded-t-lg" />
                        <h4 className="mt-4 text-lg font-medium">Mapa de Oportunidades</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Explore os polos de atendimento do CIEE e encontre vagas e oportunidades de desenvolvimento profissional perto de você.
                        </p>
                        <Link
                            to="/mapa"
                            className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            Ver Mapa
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">🎮 Desafio Final</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Participe de um mini game e teste seus conhecimentos de maneira divertida!
                    Responda perguntas e descubra o quanto você sabe sobre o mercado de trabalho e os direitos dos jovens.
                </p>
                <Link
                    to="/game"
                    className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                    Jogar Agora
                </Link>
            </section>
        </div>
    );
}