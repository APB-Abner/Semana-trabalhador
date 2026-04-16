import { Link } from 'react-router-dom';

const toneClasses = {
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-emerald-600 hover:bg-emerald-700',
  purple: 'bg-violet-600 hover:bg-violet-700',
  gray: 'bg-gray-800 hover:bg-gray-950 dark:bg-zinc-700 dark:hover:bg-zinc-600',
};

function buttonClass(tone) {
  return `inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${toneClasses[tone] || toneClasses.blue}`;
}

export default function CtaButtonRow({ actions, className = '' }) {
  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {actions.map((action) => {
        if (action.href) {
          return (
            <Link key={action.label} to={action.href} className={buttonClass(action.tone)}>
              {action.label}
            </Link>
          );
        }

        return (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={buttonClass(action.tone)}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
