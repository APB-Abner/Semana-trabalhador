import { useEffect, useRef } from 'react';
import gsap from 'gsap';

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
        <div ref={containerRef} className="p-6 space-y-16">
            <section className="section text-center">
                <h2 className="text-3xl font-bold">Bem-vindo à Semana do Jovem Trabalhador</h2>
                <p className="mt-4 text-gray-700">Celebre conquistas, descubra oportunidades e trilhe novos caminhos!</p>
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">📅 Linha do Tempo</h3>
                <p className="text-gray-600 mt-2">Acompanhe a evolução dos direitos e oportunidades dos jovens no mercado de trabalho.</p>
                {/* Placeholder para futura timeline animada */}
            </section>

            <section className="section">
                <h3 className="text-2xl font-semibold">💡 Dicas e Inspirações</h3>
                <p className="text-gray-600 mt-2">Veja histórias reais de jovens e receba conselhos para sua carreira.</p>
            </section>
        </div>
    );
}
