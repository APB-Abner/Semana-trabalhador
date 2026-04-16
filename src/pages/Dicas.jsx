import { useState, useEffect } from 'react';
import dicas from '../content/dicas/index.js';
import DicaSection from '../components/DicaSection';
import ScrollSpyNav from '../components/ScrollSpyNav';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

const groupedNav = Object.values(
    dicas.reduce((acc, dica) => {
        const group = dica.group || 'Outros';
        if (!acc[group]) acc[group] = { title: group, items: [] };
        acc[group].items.push({
            id: dica.id,
            label: dica.title,
            icon: dica.icon,
        });
        return acc;
    }, {})
);

export default function Dicas() {
    const [isMenuOpen, setIsMenuOpen] = useState(() => (
        typeof window === 'undefined' ? true : window.innerWidth >= 1024
    ));
    const [isButtonFixed, setIsButtonFixed] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    useEffect(() => {
        const handleScroll = () => {
            const headerHeight = document.querySelector('[data-app-nav]')?.offsetHeight || 0;
            setIsButtonFixed(window.scrollY > headerHeight);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <PageShell size="wide" className="text-gray-900 dark:text-white">
            <PageHeader
                eyebrow="Guia prático"
                title="Dicas para Iniciar sua Carreira"
                description="Orientações objetivas para entrevista, currículo, postura profissional e primeiros passos no mercado de trabalho."
            />

            <button
                onClick={toggleMenu}
                className={`rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800 ${isButtonFixed ? 'fixed left-5 top-5 z-50' : 'mb-6'} ${isMenuOpen ? 'hidden' : 'inline-flex'}`}
                aria-label="Abrir Menu"
            >
                Abrir menu
            </button>

            <div className={`relative grid gap-8 ${isMenuOpen ? 'lg:grid-cols-[18rem_minmax(0,1fr)]' : 'lg:grid-cols-1'}`}>
                <div className={`${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                    <ScrollSpyNav groups={groupedNav} menuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen} />
                </div>

                <main className="min-w-0 space-y-8">
                    {dicas.map((dica) => (
                        <DicaSection key={dica.id} id={dica.id} title={dica.title} icon={dica.icon}>
                            {dica.content}
                        </DicaSection>
                    ))}
                </main>
            </div>
        </PageShell>
    );
}
