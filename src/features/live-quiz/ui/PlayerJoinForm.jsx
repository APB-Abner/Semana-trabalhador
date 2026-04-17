import { useState } from 'react';
import { PigeonAvatarEditor, useStoredPigeonAvatar } from '../../pigeon-avatar';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function PlayerJoinForm({ initialPin = '', onJoin }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState(initialPin);
  const [loading, setLoading] = useState(false);
  const {
    avatar,
    resetAvatar,
    saveAvatar,
    selectPreset,
    setAvatar,
  } = useStoredPigeonAvatar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onJoin?.({ name, roomPin: pin, avatar });
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
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
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
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            placeholder="000000"
          />
        </div>

        <div className="border-t border-gray-200 pt-4 dark:border-zinc-800">
          <PigeonAvatarEditor
            value={avatar}
            onChange={setAvatar}
            onPresetSelect={selectPreset}
            onSave={saveAvatar}
            onReset={resetAvatar}
            compact
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-wait disabled:bg-blue-400 dark:focus:ring-offset-zinc-900"
        >
          {loading ? 'Entrando...' : 'Entrar na sala'}
        </button>
      </form>
    </ResultPanel>
  );
}
