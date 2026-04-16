import { useState } from 'react';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function PlayerJoinForm({ initialPin = '', onJoin }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState(initialPin);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onJoin?.({ name, roomPin: pin });
    setLoading(false);
  };

  return (
    <ResultPanel>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="live-name" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Nome
          </label>
          <input
            id="live-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={32}
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            placeholder="Seu nome no placar"
          />
        </div>

        <div>
          <label htmlFor="live-pin" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            PIN da sala
          </label>
          <input
            id="live-pin"
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            pattern="[0-9]{6}"
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            placeholder="000000"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-wait disabled:bg-blue-400 dark:focus:ring-offset-zinc-900"
        >
          {loading ? 'Entrando...' : 'Entrar na sala'}
        </button>
      </form>
    </ResultPanel>
  );
}
