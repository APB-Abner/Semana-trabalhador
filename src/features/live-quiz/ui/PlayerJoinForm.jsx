import { useEffect, useState } from 'react';
import { PigeonAvatar, PigeonAvatarEditor, useStoredPigeonAvatar } from '../../pigeon-avatar';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function PlayerJoinForm({ initialPin = '', onJoin }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState(initialPin);
  const [loading, setLoading] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const {
    avatar,
    resetAvatar,
    saveAvatar,
    selectPreset,
    setAvatar,
  } = useStoredPigeonAvatar();

  useEffect(() => {
    const normalizedPin = initialPin.replace(/\D/g, '').slice(0, 6);

    if (normalizedPin) {
      setPin(normalizedPin);
    }
  }, [initialPin]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onJoin?.({ name, roomPin: pin, avatar });
    setLoading(false);
  };

  return (
    <ResultPanel className="p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-3.5">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-wait disabled:bg-blue-400 dark:focus:ring-offset-zinc-900"
        >
          {loading ? 'Entrando...' : 'Entrar na sala'}
        </button>

        <div className="border-t border-gray-200 pt-3.5 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setCustomizerOpen((open) => !open)}
            aria-expanded={customizerOpen}
            className="flex w-full items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950"
          >
            <span>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">Avatar do jogador</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Opcional.</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <PigeonAvatar avatar={avatar} size="sm" label="Preview do avatar" />
              <span className="text-xs font-bold uppercase text-blue-700 dark:text-blue-200">
                {customizerOpen ? 'Fechar' : 'Editar'}
              </span>
            </span>
          </button>

          {customizerOpen && (
            <div className="mt-3 max-h-[42svh] overflow-y-auto pr-1">
              <PigeonAvatarEditor
                value={avatar}
                onChange={setAvatar}
                onPresetSelect={selectPreset}
                onSave={saveAvatar}
                onReset={resetAvatar}
                compact
              />
            </div>
          )}
        </div>
      </form>
    </ResultPanel>
  );
}
