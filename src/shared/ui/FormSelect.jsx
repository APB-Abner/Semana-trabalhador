export default function FormSelect({ id, label, value, onChange, children, className = '' }) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
      >
        {children}
      </select>
    </label>
  );
}
