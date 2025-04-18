import { useEffect, useState } from 'react';

export default function ScrollSpyNav({ groups, menuOpen, setMenuOpen }) {
    useEffect(() => {
        const sections = document.querySelectorAll('.section'); // Certifique-se que suas seções tenham essa classe
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.id;
                    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (entry.isIntersecting) {
                        navLinks.forEach((link) => {
                            link.classList.remove('text-green-600', 'font-bold');
                        });
                        if (navLink) {
                            navLink.classList.add('text-green-600', 'font-bold');
                        }
                    }
                });
            },
            {
                rootMargin: '0px 0px -70% 0px', // dispara um pouco antes do topo
                threshold: 0.3,
            }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const header = document.querySelector('header');
        if (header) setHeaderHeight(header.offsetHeight);
    }, []);

    return (
        <aside
            className={`sticky top-0 h-[calc(100vh-1rem)] overflow-y-auto bg-white dark:bg-zinc-800 shadow-md border-r border-gray-200 dark:border-zinc-700 transition-transform duration-300 ease-in-out
                ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ marginTop: `${headerHeight}px` }}
        >
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Navegação</h2>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="w-fit p-1 rounded"
                        aria-label="Fechar Menu"
                    >
                        ✖️
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
    );
}

