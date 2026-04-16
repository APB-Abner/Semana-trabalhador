export default function RouteFallback() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center text-center text-gray-700 dark:text-gray-200">
      <div>
        <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-300">Carregando</p>
        <p className="mt-2 text-lg font-semibold">Preparando a experiência...</p>
      </div>
    </div>
  );
}
