import Carousel from '../components/Carocel.jsx';
import { diaDoTrabalhoArticle } from '../content/historias/diaDoTrabalho.js';
import CtaButtonRow from '../shared/ui/CtaButtonRow.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

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
        <PageShell size="default" className="text-gray-900 dark:text-white">
            <PageHeader
                eyebrow="História"
                title={diaDoTrabalhoArticle.title}
                description="Um panorama direto sobre o Dia do Trabalho e as conquistas que moldaram direitos, oportunidades e relações profissionais."
            />

            <article className="max-w-3xl">
                {diaDoTrabalhoArticle.sections.map((section) => (
                    <section key={section.title} className="border-t border-gray-200 py-7 first:border-t-0 first:pt-0 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">{section.title}</h2>
                        <div className="mt-3 space-y-4 text-base leading-7 text-gray-700 dark:text-gray-300">
                            {section.paragraphs.map((paragraph, index) => (
                                <p key={index}>{renderInlineContent(paragraph)}</p>
                            ))}
                        </div>
                    </section>
                ))}
            </article>

            <section className="mt-8 border-t border-gray-200 pt-8 dark:border-zinc-800">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Curiosidade</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">Fatos para conectar a história ao presente</h2>
                <div className="mt-5">
                    <Carousel />
                </div>
            </section>

            <section className="mt-8 border-t border-gray-200 pt-8 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">Continue explorando</h2>
                <CtaButtonRow
                    className="mt-4 justify-start"
                    actions={[
                        { label: 'Voltar ao topo', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }), tone: 'gray' },
                        { label: 'Ir para o game', href: '/game', tone: 'blue' },
                        { label: 'Ver dicas', href: '/dicas', tone: 'green' },
                    ]}
                />
            </section>
        </PageShell>
    );
}
