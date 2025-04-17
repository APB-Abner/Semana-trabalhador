
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
        <div ref={containerRef} className="p-6 space-y-20">
            <section className="section text-center">
                <h2 className="text-3xl font-bold">Bem-vindo à Semana do Jovem Trabalhador</h2>
                <p className="mt-4 text-gray-700">Celebre conquistas, descubra oportunidades e trilhe novos caminhos!</p>
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">📅 Linha do Tempo</h3>
                <p className="text-gray-600 mt-2">Acompanhe a evolução dos direitos e oportunidades dos jovens no mercado de trabalho.</p>
                <LinhaDoTempo/>
                
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">💡 Dicas e Inspirações</h3>
                <p className="text-gray-600 mt-2">Veja histórias reais de jovens e receba conselhos para sua carreira.</p>
                <Link to="/historias" className="inline-block mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-green-700 transition">Ir Para Histórias</Link>
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">🧠 Teste Rápido</h3>
                <p className="text-gray-600 mt-2">Descubra que tipo de trabalhador você é com um teste divertido e rápido.</p>
                <Link to="/testes" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Fazer o Teste</Link>
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">🌍 Mapa de Oportunidades</h3>
                <p className="text-gray-600 mt-2">Explore projetos, oficinas e vagas disponíveis na sua região.</p>
                <Link to="/mapa" className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Ver Mapa</Link>
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">🎮 Desafio Final</h3>
                <p className="text-gray-600 mt-2">Participe do mini game e teste seus conhecimentos de forma divertida.</p>
                <Link to="/game" className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Jogar Agora</Link>
            </section>
        </div>
    );
}