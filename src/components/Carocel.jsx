import { useState } from 'react';
import { curiosidades } from '../content/curiosidades/index.js';

export default function Carousel() {
    const [idx, setIdx] = useState(0);
    const total = curiosidades.length;

    const prev = () => setIdx((i) => (i - 1 + total) % total);
    const next = () => setIdx((i) => (i + 1) % total);

    const { titulo, texto } = curiosidades[idx];

    return (
        <div className="max-w-2xl">
            <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <button
                    type="button"
                    onClick={prev}
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-800"
                >
                    Anterior
                </button>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-950 dark:text-white">{titulo}</h3>
                    <p className="mt-2 leading-6 text-gray-700 dark:text-gray-300">{texto}</p>
                    <div className="mt-4 flex items-center justify-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {idx + 1} / {total}
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={next}
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-800"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}
