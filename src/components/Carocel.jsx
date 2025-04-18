// src/components/CuriosidadesCarousel.jsx
import { useState } from 'react';
import { curiosidades } from '../data/curiosidades';

export default function Carousel() {
    const [idx, setIdx] = useState(0);
    const total = curiosidades.length;

    const prev = () => setIdx((i) => (i - 1 + total) % total);
    const next = () => setIdx((i) => (i + 1) % total);

    const { titulo, texto } = curiosidades[idx];

    return (
        <div className="max-w-xl mx-auto p-4">
            <div className="flex flex-row items-center bg-white dark:bg-zinc-800 shadow-md rounded-lg p-6 text-center transition-colors duration-300">
                <button
                    onClick={prev}
                    className="h-min w-min px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
                >
                    ←
                </button>
                <div className="flex-grow justify-center self-center content-center px-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{titulo}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{texto}</p>
                    <div className="flex justify-center items-center mt-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {idx + 1} / {total}
                        </span>
                    </div>
                </div>
                <button
                    onClick={next}
                    className="h-min w-min px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
                >
                    →
                </button>
            </div>
        </div>
    );
}
