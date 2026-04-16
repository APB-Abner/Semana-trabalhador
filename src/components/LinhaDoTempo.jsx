import { timelineEvents } from '../content/timeline/events.js';

export default function LinhaDoTempo() {
    return (
        <ol className="relative border-l border-blue-200 pl-6 dark:border-blue-900 sm:pl-8">
            {timelineEvents.map((evento) => (
                <li key={evento.ano} className="group relative pb-8 last:pb-0">
                    <span
                        className="absolute -left-[2.05rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-4 border-slate-50 bg-blue-600 transition group-hover:scale-110 dark:border-zinc-950"
                        aria-hidden="true"
                    />
                    <div className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-8">
                        <time className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                            {evento.ano}
                        </time>
                        <p className="max-w-2xl text-base leading-7 text-gray-700 dark:text-gray-300">
                            {evento.descricao}
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
