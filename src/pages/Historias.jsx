import { Link } from 'react-router-dom';
import Carousel from '../components/Carocel.jsx';
import { diaDoTrabalhoArticle } from '../content/historias/diaDoTrabalho.js';

function renderInlineContent(parts) {
    return parts.map((part, index) => {
        if (typeof part === 'string') {
            return <span key={index}>{part}</span>;
        }

        return <strong key={index}>{part.strong}</strong>;
    });
}

export default function Historias() {
    return (
        <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-gray-100 bg-white dark:bg-zinc-900 transition-colors duration-300">
            <h1 className="text-4xl font-bold mb-6 text-center">{diaDoTrabalhoArticle.title}</h1>

            {diaDoTrabalhoArticle.sections.map((section) => (
                <section key={section.title} className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                    {section.paragraphs.map((paragraph, index) => (
                        <p key={index}>{renderInlineContent(paragraph)}</p>
                    ))}
                </section>
            ))}

            <section className="mb-6 border-t border-gray-300 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold mb-2">📌 Curiosidade</h2>
                <Carousel />
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-2">🔁 O que você gostaria de fazer agora?</h2>
                <div className="flex gap-4 flex-wrap">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Voltar ao topo
                    </button>
                    <Link
                        to="/game"
                        className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 transition"
                    >
                        Ir para Quiz
                    </Link>
                    <Link
                        to="/game"
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition"
                    >
                        Voltar para o Jogo
                    </Link>
                </div>
            </section>
        </div>
    );
}
