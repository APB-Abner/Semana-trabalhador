import { useEffect, useState } from 'react';

export default function ScrollSpySidebar({ groups, defaultOpen = true }) {
    const [menuOpen, setMenuOpen] = useState(defaultOpen);

    useEffect(() => {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.id;
                    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (entry.isIntersecting) {
                        navLinks.forEach((link) =>
                            link.classList.remove('text-green-600', 'font-bold')
                        );
                        if (navLink) {
                            navLink.classList.add('text-green-600', 'font-bold');
                        }
                    }
                });
            },
            {
                rootMargin: '0px 0px -70% 0px',
                threshold: 0.3,
            }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Botão fixo fora da área da sidebar */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`w-fit p-1 rounded fixed top-[calc(5rem+1rem)] left-5 z-50 ${menuOpen ? 'hidden' : 'block'
                    }`}
                aria-label="Abrir Menu"
            >
                📋 Abrir Menu
            </button>

            <aside
                className={`fixed md:sticky top-0 md:top-24 left-0 h-screen md:h-[calc(100vh-6rem)] w-64 z-40 bg-white dark:bg-zinc-800 shadow-md 
                    transform transition-transform duration-300 ease-in-out overflow-y-auto border-r border-gray-200 dark:border-zinc-700
                    ${menuOpen ? 'translate-x-0' : '-translate-x-80'}`}
            >
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold mb-2">Navegação</h2>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-fit p-1 rounded"
                            aria-label="Fechar sidebar"
                        >
                            ✖️ Fechar
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-4 text-sm">
                        {groups.map((group, i) => (
                            <div key={i}>
                                {group.title && (
                                    <p className="text-xs uppercase text-gray-400 mb-1">
                                        {group.title}
                                    </p>
                                )}
                                {group.items.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="nav-link block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700"
                                    >
                                        {item.icon} {item.label}
                                    </a>
                                ))}
                                <hr className="my-2 border-gray-300 dark:border-zinc-600" />
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}
