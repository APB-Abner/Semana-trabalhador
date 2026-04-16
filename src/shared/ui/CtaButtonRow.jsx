import { Link } from 'react-router-dom';

const toneClasses = {
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-green-600 hover:bg-green-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  gray: 'bg-gray-600 hover:bg-gray-700',
};

function buttonClass(tone) {
  return `rounded px-4 py-2 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${toneClasses[tone] || toneClasses.blue}`;
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
