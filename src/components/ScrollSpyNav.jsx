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
            className={`sticky top-0 h-[calc(100vh-1rem)] overflow-y-auto bg-white dark:bg-zinc-800 shadow-md border-r border-gray-200 dark:border-zinc-700 transition-transform duration-300 ease-in-out
                ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight + 16}px)` }}
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
                                    onClick={(event) => handleNavClick(event, item.id)}
                                    aria-current={activeId === item.id ? 'true' : undefined}
                                    className={`nav-link block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 ${activeId === item.id ? 'text-green-600 font-bold bg-green-50 dark:bg-zinc-700' : ''}`}
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

