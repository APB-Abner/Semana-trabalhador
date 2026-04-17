import type { CSSProperties, ReactNode } from 'react';
import { normalizePigeonAvatarState } from '../model/avatarRules';
import { PIGEON_BASE } from '../model/pigeonBase';
import type {
  PigeonAccessoryId,
  PigeonAccessorySlot,
  PigeonAvatarPalette,
  PigeonAvatarState,
  PigeonExpressionId,
  PigeonPatternId,
} from '../model/types';

type PigeonAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type PigeonAvatarProps = {
  avatar?: Partial<PigeonAvatarState> | null;
  size?: PigeonAvatarSize | number;
  className?: string;
  label?: string;
  style?: CSSProperties;
};

const sizeClasses: Record<PigeonAvatarSize, string> = {
  xs: 'h-8 w-8',
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-36 w-36',
};

const ink = '#223047';
const white = '#FFFFFF';

function Pattern({ id, palette }: { id: PigeonPatternId; palette: PigeonAvatarPalette }) {
  if (id === 'wing-bars') {
    return (
      <g fill="none" stroke={palette.accent} strokeLinecap="round" strokeWidth="4" opacity="0.72">
        <path d="M42 94 C54 102 64 108 74 111" />
        <path d="M118 94 C106 102 96 108 86 111" />
      </g>
    );
  }

  if (id === 'speckles') {
    return (
      <g fill={palette.secondary} opacity="0.55">
        <circle cx="58" cy="88" r="3" />
        <circle cx="101" cy="84" r="2.6" />
        <circle cx="68" cy="111" r="2.4" />
        <circle cx="96" cy="113" r="3" />
        <circle cx="82" cy="98" r="2" />
      </g>
    );
  }

  if (id === 'chest-dots') {
    return (
      <g fill={palette.accent} opacity="0.75">
        <circle cx="74" cy="105" r="2.8" />
        <circle cx="86" cy="105" r="2.8" />
        <circle cx="80" cy="116" r="2.8" />
      </g>
    );
  }

  return null;
}

function Eyes({ id }: { id: PigeonExpressionId }) {
  if (id === 'happy') {
    return (
      <g fill="none" stroke={ink} strokeLinecap="round" strokeWidth="4.5">
        <path d="M56 62 Q64 70 72 62" />
        <path d="M88 62 Q96 70 104 62" />
      </g>
    );
  }

  if (id === 'wink') {
    return (
      <g>
        <circle cx="64" cy="63" r="12" fill={white} stroke={ink} strokeWidth="3" />
        <circle cx="67" cy="65" r="5" fill={ink} />
        <circle cx="69.5" cy="62" r="1.8" fill={white} />
        <path d="M90 62 Q98 69 106 62" fill="none" stroke={ink} strokeLinecap="round" strokeWidth="4.5" />
      </g>
    );
  }

  if (id === 'focused') {
    return (
      <g>
        <path d="M51 50 L73 56" stroke={ink} strokeLinecap="round" strokeWidth="4.5" />
        <path d="M109 50 L87 56" stroke={ink} strokeLinecap="round" strokeWidth="4.5" />
        <circle cx="64" cy="64" r="11" fill={white} stroke={ink} strokeWidth="3" />
        <circle cx="96" cy="64" r="11" fill={white} stroke={ink} strokeWidth="3" />
        <circle cx="66" cy="66" r="5" fill={ink} />
        <circle cx="94" cy="66" r="5" fill={ink} />
      </g>
    );
  }

  if (id === 'sleepy') {
    return (
      <g fill="none" stroke={ink} strokeLinecap="round" strokeWidth="4">
        <path d="M56 63 Q64 59 72 63" />
        <path d="M88 63 Q96 59 104 63" />
      </g>
    );
  }

  return (
    <g>
      <circle cx="64" cy="63" r="12" fill={white} stroke={ink} strokeWidth="3" />
      <circle cx="96" cy="63" r="12" fill={white} stroke={ink} strokeWidth="3" />
      <circle cx="67" cy="65" r="5" fill={ink} />
      <circle cx="93" cy="65" r="5" fill={ink} />
      <circle cx="69.5" cy="62" r="1.8" fill={white} />
      <circle cx="95.5" cy="62" r="1.8" fill={white} />
    </g>
  );
}

function BasePigeon({ avatar }: { avatar: PigeonAvatarState }) {
  const { palette } = avatar;

  return (
    <g stroke={ink} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="80" cy="146" rx="42" ry="7" fill="#0F172A" opacity="0.14" stroke="none" />
      <path d="M45 104 C31 99 22 89 21 76 C37 77 50 85 58 98 Z" fill={palette.secondary} strokeWidth="3" />
      <path d="M115 104 C129 99 138 89 139 76 C123 77 110 85 102 98 Z" fill={palette.secondary} strokeWidth="3" />
      <path
        d="M80 29 C57 29 42 44 40 65 C28 73 22 88 25 106 C30 134 53 150 80 150 C107 150 130 134 135 106 C138 88 132 73 120 65 C118 44 103 29 80 29 Z"
        fill={palette.primary}
        strokeWidth="3.5"
      />
      <path d="M43 84 C29 92 25 114 37 128 C48 126 58 116 62 100 C57 93 51 88 43 84 Z" fill={palette.secondary} strokeWidth="3" />
      <path d="M117 84 C131 92 135 114 123 128 C112 126 102 116 98 100 C103 93 109 88 117 84 Z" fill={palette.secondary} strokeWidth="3" />
      <ellipse cx="80" cy="108" rx="31" ry="35" fill={palette.chest} strokeWidth="3" />
      <Pattern id={avatar.patternId} palette={palette} />
      {avatar.details.blush && (
        <g fill="#FB7185" opacity="0.6" stroke="none">
          <ellipse cx="49" cy="77" rx="7" ry="4.2" />
          <ellipse cx="111" cy="77" rx="7" ry="4.2" />
        </g>
      )}
      <path d="M72 72 L80 84 L88 72 Z" fill={palette.beak} strokeWidth="3" />
      <path d="M72 72 Q80 78 88 72" fill="none" strokeWidth="2.5" />
      <Eyes id={avatar.expressionId} />
      <path d="M62 144 C55 151 47 151 42 146 C48 143 54 141 62 144 Z" fill={palette.beak} strokeWidth="3" />
      <path d="M98 144 C105 151 113 151 118 146 C112 143 106 141 98 144 Z" fill={palette.beak} strokeWidth="3" />
    </g>
  );
}

function HeadAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  const common = { stroke: ink, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

  if (id === 'neon-headphones') {
    return (
      <g {...common}>
        <path d="M45 61 C45 32 115 32 115 61" fill="none" stroke={palette.accent} strokeWidth="7" />
        <rect x="35" y="55" width="18" height="31" rx="8" fill={palette.secondary} strokeWidth="3" />
        <rect x="107" y="55" width="18" height="31" rx="8" fill={palette.secondary} strokeWidth="3" />
      </g>
    );
  }

  if (id === 'rally-cap') {
    return (
      <g {...common}>
        <path d="M47 42 C56 26 97 24 111 42 L108 51 C88 44 66 44 49 51 Z" fill={palette.accent} strokeWidth="3" />
        <path d="M88 44 C105 43 118 47 126 55 C111 59 98 57 86 51 Z" fill={palette.secondary} strokeWidth="3" />
      </g>
    );
  }

  if (id === 'pop-crown') {
    return (
      <g {...common}>
        <path d="M55 45 L60 26 L73 41 L81 24 L90 41 L103 26 L107 45 Z" fill={palette.accent} strokeWidth="3" />
        <path d="M56 45 L106 45 L103 53 L59 53 Z" fill="#FDE68A" strokeWidth="3" />
      </g>
    );
  }

  if (id === 'pirate-bandana') {
    return (
      <g {...common}>
        <path d="M45 49 C58 35 93 34 113 49 L108 59 C91 51 66 51 50 59 Z" fill={palette.accent} strokeWidth="3" />
        <path d="M104 50 L126 43 L118 62 Z" fill={palette.accent} strokeWidth="3" />
      </g>
    );
  }

  if (id === 'explorer-hat') {
    return (
      <g {...common}>
        <path d="M49 45 C55 28 105 28 111 45 L106 55 C90 50 70 50 54 55 Z" fill="#C8B07A" strokeWidth="3" />
        <path d="M37 54 C58 45 103 45 124 54 C107 65 56 65 37 54 Z" fill="#D6C08A" strokeWidth="3" />
        <path d="M58 43 C73 48 90 48 104 43" fill="none" stroke={palette.accent} strokeWidth="4" />
      </g>
    );
  }

  if (id === 'gala-top-hat') {
    return (
      <g {...common}>
        <path d="M59 24 H100 L97 50 H62 Z" fill={palette.secondary} strokeWidth="3" />
        <path d="M56 39 H102 V49 H56 Z" fill={palette.accent} strokeWidth="2.5" />
        <path d="M43 51 C58 45 103 45 118 51 C104 61 57 61 43 51 Z" fill={palette.secondary} strokeWidth="3" />
      </g>
    );
  }

  return null;
}

function FaceAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  if (id === 'round-glasses') {
    return (
      <g fill="none" stroke={palette.accent} strokeLinecap="round" strokeWidth="4">
        <circle cx="64" cy="64" r="15" />
        <circle cx="96" cy="64" r="15" />
        <path d="M79 64 H81 M49 62 L43 59 M111 62 L117 59" />
      </g>
    );
  }

  if (id === 'visor-glasses') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M48 56 H112 L106 72 H54 Z" fill="#111827" strokeWidth="3" />
        <path d="M56 62 H75 M85 62 H104" stroke={palette.accent} strokeLinecap="round" strokeWidth="3" />
      </g>
    );
  }

  if (id === 'star-glasses') {
    const star = 'M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z';
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d={star} transform="translate(64 63)" fill={palette.accent} strokeWidth="2.6" />
        <path d={star} transform="translate(96 63)" fill={palette.accent} strokeWidth="2.6" />
        <path d="M75 63 H85" stroke={ink} strokeLinecap="round" strokeWidth="3" />
      </g>
    );
  }

  if (id === 'eye-patch') {
    return (
      <g stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path d="M46 48 C68 57 91 63 115 79" fill="none" strokeWidth="3" />
        <path d="M84 57 C92 51 105 54 109 64 C105 75 91 77 84 68 Z" fill="#111827" strokeWidth="3" />
      </g>
    );
  }

  if (id === 'monocle') {
    return (
      <g fill="none" stroke={palette.accent} strokeLinecap="round" strokeWidth="3.5">
        <circle cx="96" cy="64" r="15" />
        <path d="M108 74 C117 82 116 94 109 100" />
      </g>
    );
  }

  return null;
}

function NeckAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  if (id === 'office-tie') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M73 86 H87 L84 96 H76 Z M76 96 L69 126 L80 137 L91 126 L84 96 Z" fill={palette.accent} strokeWidth="2.5" />
      </g>
    );
  }

  if (id === 'gold-chain') {
    return (
      <g fill="none" stroke="#FACC15" strokeWidth="4" strokeLinecap="round">
        <path d="M54 89 C66 104 94 104 106 89" />
        <circle cx="66" cy="98" r="3" />
        <circle cx="80" cy="102" r="3" />
        <circle cx="94" cy="98" r="3" />
      </g>
    );
  }

  if (id === 'bow-tie') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M79 92 L58 82 V103 Z" fill={palette.accent} strokeWidth="3" />
        <path d="M81 92 L102 82 V103 Z" fill={palette.accent} strokeWidth="3" />
        <rect x="75" y="86" width="10" height="13" rx="3" fill={palette.secondary} strokeWidth="3" />
      </g>
    );
  }

  if (id === 'explorer-bandana') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M56 88 C69 99 91 99 104 88 L84 119 H76 Z" fill={palette.accent} strokeWidth="3" />
      </g>
    );
  }

  return null;
}

function BodyAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  const bodyColors: Record<PigeonAccessoryId, string> = {
    'gamer-hoodie': '#1F2937',
    'professor-cardigan': '#3B4A60',
    'pop-jacket': palette.accent,
    'pirate-sash': palette.accent,
    'explorer-vest': '#8B6F45',
    'gala-jacket': '#111827',
  };
  const color = bodyColors[id];

  if (!color) {
    return null;
  }

  if (id === 'pirate-sash') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M52 94 C74 104 93 118 107 139 L96 145 C80 121 63 109 45 103 Z" fill={palette.accent} strokeWidth="3" />
        <circle cx="76" cy="113" r="4" fill="#FACC15" strokeWidth="2.5" />
      </g>
    );
  }

  return (
    <g stroke={ink} strokeLinejoin="round" strokeLinecap="round">
      <path d="M49 102 C60 94 100 94 111 102 L106 137 C92 145 68 145 54 137 Z" fill={color} strokeWidth="3" />
      <path d="M62 99 L80 130 L98 99" fill={id === 'gala-jacket' ? white : palette.chest} strokeWidth="3" />
      {(id === 'explorer-vest' || id === 'professor-cardigan') && (
        <>
          <rect x="58" y="116" width="16" height="11" rx="2" fill={id === 'explorer-vest' ? '#D6C08A' : palette.accent} strokeWidth="2.5" />
          <rect x="86" y="116" width="16" height="11" rx="2" fill={id === 'explorer-vest' ? '#D6C08A' : palette.accent} strokeWidth="2.5" />
        </>
      )}
      {id === 'gamer-hoodie' && <path d="M80 104 V139" stroke={palette.accent} strokeWidth="3" />}
    </g>
  );
}

function HandAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  if (id === 'game-controller') {
    return (
      <g transform="translate(105 110) rotate(9)" stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <path d="M0 9 C0 0 27 0 27 9 L31 22 C29 28 22 24 19 18 H8 C5 24 -2 28 -4 22 Z" fill="#111827" strokeWidth="3" />
        <path d="M7 10 H14 M10.5 6.5 V13.5" stroke={palette.accent} strokeWidth="2.5" />
        <circle cx="21" cy="9" r="2.2" fill={palette.accent} stroke="none" />
        <circle cx="26" cy="13" r="2.2" fill={palette.accent} stroke="none" />
      </g>
    );
  }

  if (id === 'lesson-book') {
    return (
      <g transform="translate(105 103) rotate(8)" stroke={ink} strokeLinejoin="round">
        <path d="M0 5 C8 1 15 2 22 8 V31 C14 27 7 27 0 31 Z" fill={white} strokeWidth="3" />
        <path d="M22 8 C29 2 36 1 44 5 V31 C37 27 30 27 22 31 Z" fill={palette.chest} strokeWidth="3" />
        <path d="M22 8 V31" strokeWidth="2.5" />
      </g>
    );
  }

  if (id === 'pop-microphone') {
    return (
      <g transform="translate(113 99) rotate(-20)" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="9" fill={palette.accent} strokeWidth="3" />
        <path d="M17 17 L34 39" strokeWidth="5" />
      </g>
    );
  }

  if (id === 'treasure-map') {
    return (
      <g transform="translate(104 103) rotate(8)" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 4 C10 0 18 8 28 4 C34 2 38 4 41 7 L37 33 C29 28 21 35 12 31 C6 28 2 31 -3 34 Z" fill="#FDE68A" strokeWidth="3" />
        <path d="M12 12 L20 20 M20 12 L12 20" stroke={palette.accent} strokeWidth="3" />
      </g>
    );
  }

  if (id === 'compass') {
    return (
      <g transform="translate(113 107)" stroke={ink} strokeLinejoin="round">
        <circle cx="14" cy="14" r="15" fill={white} strokeWidth="3" />
        <path d="M14 4 L20 18 L14 24 L8 10 Z" fill={palette.accent} strokeWidth="2.5" />
      </g>
    );
  }

  if (id === 'gala-cane') {
    return (
      <g transform="translate(116 100)" fill="none" stroke={ink} strokeLinecap="round">
        <path d="M17 3 C4 0 4 15 16 14" stroke={palette.accent} strokeWidth="5" />
        <path d="M17 14 L27 50" strokeWidth="5" />
      </g>
    );
  }

  return null;
}

function ExtraAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  if (id === 'sparkle-burst') {
    return (
      <g fill="none" stroke={palette.accent} strokeLinecap="round" strokeWidth="3">
        <path d="M29 43 V55 M23 49 H35 M129 41 V53 M123 47 H135 M133 100 V110 M128 105 H138" />
      </g>
    );
  }

  if (id === 'chalk-stars') {
    return (
      <g fill="none" stroke={white} strokeLinecap="round" strokeWidth="3" opacity="0.9">
        <path d="M28 45 L34 51 M34 45 L28 51 M124 48 L131 55 M131 48 L124 55 M122 97 L128 103 M128 97 L122 103" />
      </g>
    );
  }

  if (id === 'map-pin') {
    return (
      <g transform="translate(118 37)" stroke={ink} strokeLinejoin="round">
        <path d="M14 0 C6 0 0 6 0 14 C0 24 14 38 14 38 C14 38 28 24 28 14 C28 6 22 0 14 0 Z" fill={palette.accent} strokeWidth="3" />
        <circle cx="14" cy="14" r="5" fill={white} strokeWidth="2.5" />
      </g>
    );
  }

  return null;
}

function AccessoryLayer({
  avatar,
  slot,
}: {
  avatar: PigeonAvatarState;
  slot: PigeonAccessorySlot;
}) {
  const id = avatar.equipped[slot];

  if (!id) {
    return null;
  }

  const renderers: Record<PigeonAccessorySlot, ReactNode> = {
    extra: <ExtraAccessory id={id} palette={avatar.palette} />,
    body: <BodyAccessory id={id} palette={avatar.palette} />,
    neck: <NeckAccessory id={id} palette={avatar.palette} />,
    hand: <HandAccessory id={id} palette={avatar.palette} />,
    face: <FaceAccessory id={id} palette={avatar.palette} />,
    head: <HeadAccessory id={id} palette={avatar.palette} />,
  };

  return renderers[slot];
}

export default function PigeonAvatar({
  avatar,
  size = 'md',
  className = '',
  label = 'Avatar de pombo',
  style,
}: PigeonAvatarProps) {
  const normalizedAvatar = normalizePigeonAvatarState(avatar);
  const numericSize = typeof size === 'number' ? `${size}px` : undefined;
  const sizeClass = typeof size === 'number' ? '' : sizeClasses[size];

  return (
    <svg
      viewBox={PIGEON_BASE.viewBox}
      role="img"
      aria-label={label}
      className={`inline-block shrink-0 overflow-visible ${sizeClass} ${className}`}
      style={{ width: numericSize, height: numericSize, ...style }}
    >
      <AccessoryLayer avatar={normalizedAvatar} slot="extra" />
      <BasePigeon avatar={normalizedAvatar} />
      <AccessoryLayer avatar={normalizedAvatar} slot="body" />
      <AccessoryLayer avatar={normalizedAvatar} slot="neck" />
      <AccessoryLayer avatar={normalizedAvatar} slot="hand" />
      <AccessoryLayer avatar={normalizedAvatar} slot="face" />
      <AccessoryLayer avatar={normalizedAvatar} slot="head" />
    </svg>
  );
}
