import { useState, useEffect } from 'react';
import dicas from '../data/Contenddicas';
import DicaSection from '../components/DicaSection';
import ScrollSpyNav from '../components/ScrollSpyNav';

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
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isButtonFixed, setIsButtonFixed] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    useEffect(() => {
        const handleScroll = () => {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            setIsButtonFixed(window.scrollY > headerHeight);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Dicas para Iniciar sua Carreira</h2>
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                Se você está começando sua jornada no mercado de trabalho, aqui estão algumas dicas valiosas para ajudá-lo a dar os primeiros passos com confiança!
            </p>

            {/* Botão flutuante */}
            <button
                onClick={toggleMenu}
                className={`fixed z-50 left-5 transition-all duration-300 bg-white dark:bg-zinc-900 p-2 rounded-2xl ${isButtonFixed ? 'top-5' : 'top-[calc(5rem+1rem)]'} ${isMenuOpen ? 'hidden' : 'block'}`}
                aria-label="Abrir Menu"
            >
                📋 Abrir Menu
            </button>

            {/* Layout principal */}
            <div className="flex relative gap-6">
                {/* Sidebar */}
                <div className={`${isMenuOpen ? 'w-64' : 'w-0'} transition-all duration-300`}>
                    <ScrollSpyNav groups={groupedNav} menuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen} />
                </div>

                {/* Conteúdo */}
                <div className="flex-1 overflow-hidden">
                    {dicas.map((dica) => (
                        <DicaSection key={dica.id} id={dica.id} title={dica.title} icon={dica.icon}>
                            {dica.content}
                        </DicaSection>
                    ))}
                </div>
            </div>
        </div>
    );
}
