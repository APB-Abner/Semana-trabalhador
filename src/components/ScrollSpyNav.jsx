import React, { useEffect } from 'react';


const ScrollSpyNav = ({ items }) => {
    useEffect(() => {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        const onScroll = () => {
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const link = navLinks[index];
                if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                    link.classList.add('text-green-600');
                } else {
                    link.classList.remove('text-green-600');
                }
            });
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className="sticky top-0 bg-white dark:bg-zinc-800 shadow-md p-4 max-h-screen overflow-y-auto">
            <ul className="space-y-2">
                {items.map(({ id, title, icon }) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            className="nav-link text-lg text-gray-600 dark:text-gray-400 transition-colors duration-200 hover:text-green-700 dark:hover:text-green-400"
                        >
                            {icon} {title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ScrollSpyNav;
