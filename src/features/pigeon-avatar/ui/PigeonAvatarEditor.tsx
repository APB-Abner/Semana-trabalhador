import { applyPigeonPreset, equipPigeonAccessory, normalizePigeonAvatarState } from '../model/avatarRules';
import { getPigeonAccessoriesBySlot, PIGEON_ACCESSORY_SLOT_LABELS } from '../model/accessories';
import { PIGEON_EXPRESSIONS, PIGEON_PATTERNS } from '../model/options';
import { PIGEON_PRESETS } from '../model/presets';
import { PIGEON_ACCESSORY_SLOTS } from '../model/types';
import type {
  PigeonAccessorySlot,
  PigeonAvatarPalette,
  PigeonAvatarState,
  PigeonPresetId,
} from '../model/types';
import PigeonAvatar from './PigeonAvatar';

type PigeonAvatarEditorProps = {
  value: PigeonAvatarState;
  onChange: (nextAvatar: PigeonAvatarState) => void;
  onSave?: () => void;
  onReset?: () => void;
  onPresetSelect?: (presetId: PigeonPresetId) => void;
  compact?: boolean;
};

const paletteControls: Array<{ key: keyof PigeonAvatarPalette; label: string }> = [
  { key: 'primary', label: 'Principal' },
  { key: 'secondary', label: 'Asas' },
  { key: 'chest', label: 'Peito' },
  { key: 'beak', label: 'Bico' },
  { key: 'accent', label: 'Acento' },
];

function fieldId(prefix: string, value: string) {
  return `${prefix}-${value}`;
}

export default function PigeonAvatarEditor({
  value,
  onChange,
  onSave,
  onReset,
  onPresetSelect,
  compact = false,
}: PigeonAvatarEditorProps) {
  const avatar = normalizePigeonAvatarState(value);

  const updateAvatar = (nextAvatar: PigeonAvatarState) => {
    onChange(normalizePigeonAvatarState(nextAvatar));
  };

  const updatePalette = (key: keyof PigeonAvatarPalette, color: string) => {
    updateAvatar({
      ...avatar,
      selectedPresetId: null,
      palette: { ...avatar.palette, [key]: color },
    });
  };

  const updateSlot = (slot: PigeonAccessorySlot, accessoryId: string) => {
    updateAvatar(equipPigeonAccessory(avatar, slot, accessoryId || null));
  };

  const selectPreset = (presetId: PigeonPresetId) => {
    if (onPresetSelect) {
      onPresetSelect(presetId);
      return;
    }

    updateAvatar(applyPigeonPreset(avatar, presetId));
  };

  return (
    <section className="space-y-5" aria-label="Customizador de avatar do pombo">
      <div className="grid gap-5 md:grid-cols-[9rem_1fr] md:items-start">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-36 w-36 place-items-center rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
            <PigeonAvatar avatar={avatar} size="xl" />
          </div>
          {!compact && (
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
              {avatar.selectedPresetId ? 'Preset ativo' : 'Custom livre'}
            </p>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Presets</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PIGEON_PRESETS.map((preset) => {
                const presetAvatar = applyPigeonPreset(avatar, preset.id);
                const selected = avatar.selectedPresetId === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset.id)}
                    aria-pressed={selected}
                    className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-md border px-2 py-2 text-xs font-semibold transition ${
                      selected
                        ? 'border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-300 dark:bg-blue-950 dark:text-blue-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-blue-700 dark:hover:bg-blue-950'
                    }`}
                  >
                    <PigeonAvatar avatar={presetAvatar} size="sm" label={`Preview ${preset.label}`} />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cores</h3>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {paletteControls.map((control) => (
                <label key={control.key} htmlFor={fieldId('pigeon-color', control.key)} className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                  <span>{control.label}</span>
                  <input
                    id={fieldId('pigeon-color', control.key)}
                    type="color"
                    value={avatar.palette[control.key]}
                    onChange={(event) => updatePalette(control.key, event.target.value)}
                    className="mt-1 h-9 w-full cursor-pointer rounded-md border border-slate-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label htmlFor="pigeon-pattern" className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
              Padrao
              <select
                id="pigeon-pattern"
                value={avatar.patternId}
                onChange={(event) => updateAvatar({ ...avatar, selectedPresetId: null, patternId: event.target.value as PigeonAvatarState['patternId'] })}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >
                {PIGEON_PATTERNS.map((pattern) => (
                  <option key={pattern.id} value={pattern.id}>{pattern.label}</option>
                ))}
              </select>
            </label>

            <label htmlFor="pigeon-expression" className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
              Expressao
              <select
                id="pigeon-expression"
                value={avatar.expressionId}
                onChange={(event) => updateAvatar({ ...avatar, selectedPresetId: null, expressionId: event.target.value as PigeonAvatarState['expressionId'] })}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >
                {PIGEON_EXPRESSIONS.map((expression) => (
                  <option key={expression.id} value={expression.id}>{expression.label}</option>
                ))}
              </select>
            </label>

            <label className="flex items-end gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-zinc-800 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={avatar.details.blush}
                onChange={(event) => updateAvatar({ ...avatar, selectedPresetId: null, details: { ...avatar.details, blush: event.target.checked } })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Blush
            </label>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Acessorios</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PIGEON_ACCESSORY_SLOTS.map((slot) => (
                <label key={slot} htmlFor={fieldId('pigeon-slot', slot)} className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                  {PIGEON_ACCESSORY_SLOT_LABELS[slot]}
                  <select
                    id={fieldId('pigeon-slot', slot)}
                    value={avatar.equipped[slot] ?? ''}
                    onChange={(event) => updateSlot(slot, event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="">Nenhum</option>
                    {getPigeonAccessoriesBySlot(slot).map((accessory) => (
                      <option key={accessory.id} value={accessory.id}>{accessory.label}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4 dark:border-zinc-800">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
          >
            Resetar
          </button>
        )}
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            Salvar avatar
          </button>
        )}
      </div>
    </section>
  );
}
