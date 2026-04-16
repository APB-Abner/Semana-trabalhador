import Badge from './Badge.jsx';

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = 'left',
  className = '',
}) {
  const alignClass = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <header className={`mb-8 max-w-3xl ${alignClass} ${className}`}>
      {eyebrow && <Badge tone="blue">{eyebrow}</Badge>}
      <h1 className="font-display mt-4 text-3xl font-bold leading-tight text-gray-950 dark:text-white sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
          {description}
        </p>
      )}
      {actions && <div className="mt-6">{actions}</div>}
    </header>
  );
}
