export default function PageShell({ children, className = '', size = 'wide' }) {
  const sizeClass = {
    narrow: 'max-w-3xl',
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-none',
  }[size] || 'max-w-7xl';

  return (
    <div className={`mx-auto w-full ${sizeClass} px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
