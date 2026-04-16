import { useEffect, useState } from 'react';

export default function ScrollSpyNav({ groups, menuOpen, setMenuOpen }) {
    const firstItemId = groups[0]?.items[0]?.id || '';
    const [activeId, setActiveId] = useState(firstItemId);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const updateHeaderHeight = () => {
            const appNav = document.querySelector('[data-app-nav]');
            setHeaderHeight(appNav?.offsetHeight || 0);
        };

        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll('[data-scroll-section]');
        if (!sections.length) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visibleEntry?.target.id) {
                    setActiveId(visibleEntry.target.id);
                }
            },
            {
                rootMargin: `-${headerHeight + 12}px 0px -65% 0px`,
                threshold: [0.2, 0.4, 0.6],
            }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [headerHeight]);

    const handleNavClick = (event, id) => {
        event.preventDefault();
        const section = document.getElementById(id);
        if (!section) return;

        const top = section.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        setActiveId(id);
        window.history.replaceState(null, '', `#${id}`);
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <aside
            className={`sticky top-0 h-[calc(100vh-1rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white/95 shadow-sm shadow-gray-200/50 transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900/95 dark:shadow-none
                ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight + 16}px)` }}
        >
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-950 dark:text-white">Conteúdos</h2>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="rounded px-2 py-1 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-300 dark:hover:bg-zinc-800"
                        aria-label="Fechar Menu"
                    >
                        Fechar
                    </button>
                </div>

                <nav className="flex flex-col space-y-4 text-sm" aria-label="Navegação de dicas">
                    {groups.map((group, i) => (
                        <div key={i}>
                            {group.title && (
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    {group.title}
                                </p>
                            )}
                            {group.items.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(event) => handleNavClick(event, item.id)}
                                    aria-current={activeId === item.id ? 'true' : undefined}
                                    className={`nav-link block rounded-md px-3 py-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:hover:bg-zinc-800 ${activeId === item.id ? 'bg-blue-50 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                    {item.icon} {item.label}
                                </a>
                            ))}
                            <hr className="my-3 border-gray-200 dark:border-zinc-800" />
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

