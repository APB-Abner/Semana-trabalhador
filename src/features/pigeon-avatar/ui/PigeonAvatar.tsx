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

const ink = '#15181E';
const white = '#FFFFFF';
const lens = '#101318';

function Pattern({ id, palette }: { id: PigeonPatternId; palette: PigeonAvatarPalette }) {
  if (id === 'wing-bars') {
    return (
      <g fill="none" stroke={palette.accent} strokeLinecap="round" strokeWidth="5" opacity="0.68">
        <path d="M40 102 C50 109 61 113 72 114" />
        <path d="M120 102 C110 109 99 113 88 114" />
        <path d="M61 128 C72 134 88 134 99 128" opacity="0.42" />
      </g>
    );
  }

  if (id === 'speckles') {
    return (
      <g fill={palette.secondary} opacity="0.34" stroke="none">
        <circle cx="55" cy="93" r="3.6" />
        <circle cx="104" cy="93" r="3.4" />
        <circle cx="66" cy="122" r="3.2" />
        <circle cx="94" cy="122" r="3.4" />
      </g>
    );
  }

  if (id === 'chest-dots') {
    return (
      <g fill={palette.accent} opacity="0.72" stroke="none">
        <circle cx="72" cy="105" r="3.4" />
        <circle cx="88" cy="105" r="3.4" />
        <circle cx="80" cy="119" r="3.4" />
      </g>
    );
  }

  return null;
}

function Eyes({ id }: { id: PigeonExpressionId }) {
  if (id === 'happy') {
    return (
      <g fill="none" stroke={ink} strokeLinecap="round" strokeWidth="5.2">
        <path d="M52 61 Q62 70 73 61" />
        <path d="M87 61 Q98 70 108 61" />
      </g>
    );
  }

  if (id === 'wink') {
    return (
      <g>
        <ellipse cx="62" cy="61" rx="14.8" ry="17.2" fill={white} stroke={ink} strokeWidth="3.6" />
        <circle cx="66" cy="64" r="6.9" fill={ink} />
        <circle cx="69" cy="58.4" r="2.6" fill={white} />
        <path d="M88 61 Q98 69 109 61" fill="none" stroke={ink} strokeLinecap="round" strokeWidth="5.2" />
      </g>
    );
  }

  if (id === 'focused') {
    return (
      <g>
        <path d="M48 49 L74 55" stroke={ink} strokeLinecap="round" strokeWidth="5" />
        <path d="M112 49 L86 55" stroke={ink} strokeLinecap="round" strokeWidth="5" />
        <ellipse cx="62" cy="62" rx="14" ry="16" fill={white} stroke={ink} strokeWidth="3.6" />
        <ellipse cx="98" cy="62" rx="14" ry="16" fill={white} stroke={ink} strokeWidth="3.6" />
        <circle cx="66" cy="65" r="6.6" fill={ink} />
        <circle cx="94" cy="65" r="6.6" fill={ink} />
        <circle cx="68.8" cy="59.5" r="2.4" fill={white} />
        <circle cx="96.8" cy="59.5" r="2.4" fill={white} />
      </g>
    );
  }

  if (id === 'sleepy') {
    return (
      <g fill="none" stroke={ink} strokeLinecap="round" strokeWidth="5">
        <path d="M52 64 Q63 58 74 64" />
        <path d="M86 64 Q97 58 108 64" />
      </g>
    );
  }

  return (
    <g>
      <ellipse cx="62" cy="61" rx="15" ry="17.2" fill={white} stroke={ink} strokeWidth="3.6" />
      <ellipse cx="98" cy="61" rx="15" ry="17.2" fill={white} stroke={ink} strokeWidth="3.6" />
      <circle cx="66" cy="64" r="7" fill={ink} />
      <circle cx="94" cy="64" r="7" fill={ink} />
      <circle cx="69" cy="58.2" r="2.7" fill={white} />
      <circle cx="97" cy="58.2" r="2.7" fill={white} />
    </g>
  );
}

function BasePigeon({ avatar }: { avatar: PigeonAvatarState }) {
  const { palette } = avatar;

  return (
    <g stroke={ink} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="80" cy="150" rx="45" ry="8" fill="#0F172A" opacity="0.22" stroke="none" />

      <path
        d="M120 110 C136 108 147 117 151 131 C138 131 127 126 118 118 Z"
        fill={palette.secondary}
        strokeWidth="3.4"
      />
      <path
        d="M34 96 C18 87 17 66 32 56 C49 62 58 77 60 94 C54 102 43 104 34 96 Z"
        fill={palette.secondary}
        strokeWidth="3.7"
      />
      <path
        d="M126 96 C142 87 143 66 128 56 C111 62 102 77 100 94 C106 102 117 104 126 96 Z"
        fill={palette.secondary}
        strokeWidth="3.7"
      />

      <path
        d="M80 21
           C55 21 39 36 36 58
           C25 68 21 86 25 108
           C30 137 51 151 80 151
           C109 151 130 137 135 108
           C139 86 135 68 124 58
           C121 36 105 21 80 21 Z"
        fill={palette.primary}
        strokeWidth="4.6"
      />

      <path
        d="M42 69 C52 78 65 82 80 82 C96 82 108 78 118 69"
        fill="none"
        stroke={white}
        strokeWidth="12"
        opacity="0.2"
      />
      <path
        d="M40 91 C51 101 65 107 80 107 C96 107 109 101 120 91"
        fill="none"
        stroke={palette.secondary}
        strokeWidth="11"
        opacity="0.2"
      />

      <path
        d="M44 84
           C54 94 66 100 80 100
           C94 100 106 94 116 84
           C119 105 111 128 96 136
           C91 132 87 132 84 139
           C81 142 79 142 76 139
           C73 132 69 132 64 136
           C49 128 41 105 44 84 Z"
        fill={palette.chest}
        strokeWidth="3.5"
      />
      <path
        d="M54 114 C59 121 65 121 69 114 C73 123 79 123 83 114 C87 123 93 123 97 114 C101 121 107 121 112 114"
        fill="none"
        stroke={ink}
        strokeWidth="2.5"
        opacity="0.76"
      />

      <Pattern id={avatar.patternId} palette={palette} />

      {avatar.details.blush && (
        <g fill="#FB7185" opacity="0.44" stroke="none">
          <ellipse cx="47" cy="79" rx="7" ry="4.2" />
          <ellipse cx="113" cy="79" rx="7" ry="4.2" />
        </g>
      )}

      <Eyes id={avatar.expressionId} />

      <g>
        <path
          d="M63 72 C70 63 90 63 97 72 C92 82 69 83 63 72 Z"
          fill={palette.beak}
          strokeWidth="3.6"
        />
        <path
          d="M67 76 C74 84 88 84 94 76 C89 90 72 91 67 76 Z"
          fill={palette.beak}
          opacity="0.72"
          strokeWidth="3"
        />
        <path d="M70 75 Q80 80 91 75" fill="none" strokeWidth="2.4" opacity="0.7" />
      </g>

      <path
        d="M43 98 C31 105 32 122 44 132 C55 127 61 115 62 103 C57 99 49 97 43 98 Z"
        fill={palette.secondary}
        strokeWidth="3.7"
      />
      <path
        d="M117 98 C129 105 128 122 116 132 C105 127 99 115 98 103 C103 99 111 97 117 98 Z"
        fill={palette.secondary}
        strokeWidth="3.7"
      />
      <path d="M47 111 C51 115 56 117 60 118" fill="none" stroke={ink} strokeWidth="2.5" opacity="0.36" />
      <path d="M113 111 C109 115 104 117 100 118" fill="none" stroke={ink} strokeWidth="2.5" opacity="0.36" />

      <path
        d="M62 144 C54 151 45 151 38 145 C47 141 55 141 62 144 Z"
        fill={palette.beak}
        strokeWidth="3.3"
      />
      <path
        d="M98 144 C106 151 115 151 122 145 C113 141 105 141 98 144 Z"
        fill={palette.beak}
        strokeWidth="3.3"
      />
    </g>
  );
}

function HeadAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  const common = { stroke: ink, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

  if (id === 'neon-headphones') {
    return (
      <g {...common}>
        <path d="M42 62 C42 28 118 28 118 62" fill="none" stroke={palette.accent} strokeWidth="6.5" />
        <rect x="30" y="56" width="18" height="31" rx="8" fill="#1F2937" strokeWidth="3.2" />
        <rect x="112" y="56" width="18" height="31" rx="8" fill="#1F2937" strokeWidth="3.2" />
        <rect x="35" y="62" width="7" height="18" rx="3.5" fill={palette.secondary} stroke="none" />
        <rect x="118" y="62" width="7" height="18" rx="3.5" fill={palette.secondary} stroke="none" />
      </g>
    );
  }

  if (id === 'rally-cap') {
    return (
      <g {...common}>
        <path d="M47 43 C57 29 99 27 112 42 L109 53 C91 47 67 47 50 53 Z" fill={palette.accent} strokeWidth="3.2" />
        <path d="M80 31 C85 37 87 44 87 52" fill="none" stroke={ink} strokeWidth="2.6" opacity="0.6" />
        <path d="M89 45 C108 44 121 48 129 55 C113 61 98 58 87 52 Z" fill={palette.secondary} strokeWidth="3.2" />
      </g>
    );
  }

  if (id === 'pop-crown') {
    return (
      <g {...common}>
        <path d="M78 8 C86 23 91 38 91 53 C86 50 79 50 73 53 C73 38 74 23 78 8 Z" fill={white} strokeWidth="3.4" />
        <path d="M76 22 C80 25 84 25 88 22 M75 34 C80 37 86 37 90 34" fill="none" stroke={palette.accent} strokeWidth="3" />
        <path d="M48 48 C58 38 72 39 80 51 C88 39 102 38 112 48 C96 45 64 45 48 48 Z" fill={palette.secondary} strokeWidth="3.2" />
      </g>
    );
  }

  if (id === 'pirate-bandana') {
    return (
      <g {...common}>
        <path d="M44 49 C58 35 96 34 116 49 L110 60 C92 52 66 52 50 60 Z" fill={palette.accent} strokeWidth="3.2" />
        <circle cx="80" cy="48" r="4" fill={white} strokeWidth="2.4" />
        <path d="M106 50 L130 42 L119 65 Z" fill={palette.accent} strokeWidth="3.2" />
      </g>
    );
  }

  if (id === 'explorer-hat') {
    return (
      <g {...common}>
        <path d="M49 42 C56 25 104 25 111 42 L106 55 C91 50 69 50 54 55 Z" fill="#E3E6EC" strokeWidth="3.5" />
        <path d="M33 52 C56 42 104 42 127 52 C113 65 47 65 33 52 Z" fill="#F0F2F5" strokeWidth="3.6" />
        <path d="M52 45 C69 50 91 50 108 45" fill="none" stroke={palette.accent} strokeWidth="4.6" />
        <path d="M38 55 C60 60 100 60 122 55" fill="none" stroke={ink} strokeWidth="2.3" opacity="0.35" />
      </g>
    );
  }

  if (id === 'gala-top-hat') {
    return (
      <g {...common}>
        <path d="M60 24 H101 L98 51 H62 Z" fill={palette.secondary} strokeWidth="3.2" />
        <path d="M56 39 H103 V50 H56 Z" fill={palette.accent} strokeWidth="2.6" />
        <path d="M42 52 C58 45 103 45 119 52 C104 62 57 62 42 52 Z" fill={palette.secondary} strokeWidth="3.2" />
      </g>
    );
  }

  return null;
}

function FaceAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  if (id === 'round-glasses') {
    return (
      <g stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <rect x="46" y="50" width="33" height="27" rx="9" fill={white} strokeWidth="4.4" />
        <rect x="81" y="50" width="33" height="27" rx="9" fill={white} strokeWidth="4.4" />
        <path d="M79 63 H82 M44 57 H35 M116 57 H125" fill="none" strokeWidth="4.2" />
        <path d="M55 56 L68 72 M91 56 L104 72" fill="none" stroke={palette.accent} strokeWidth="2.3" opacity="0.34" />
      </g>
    );
  }

  if (id === 'visor-glasses') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M45 54 H115 L109 73 H51 Z" fill={palette.accent} opacity="0.22" strokeWidth="3.3" />
        <path d="M46 59 C58 56 70 56 78 60 M82 60 C91 56 103 56 115 59" fill="none" stroke={ink} strokeLinecap="round" strokeWidth="3.2" />
        <path d="M56 62 H72 M88 62 H104" stroke={palette.accent} strokeLinecap="round" strokeWidth="3.2" />
      </g>
    );
  }

  if (id === 'heart-glasses') {
    const heart = 'M0 11 C-14 2 -10 -13 0 -8 C10 -13 14 2 0 11 Z';
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d={heart} transform="translate(62 61) scale(1.14)" fill={lens} strokeWidth="3.2" />
        <path d={heart} transform="translate(98 61) scale(1.14)" fill={lens} strokeWidth="3.2" />
        <path d="M76 62 H84" stroke={ink} strokeLinecap="round" strokeWidth="3.3" />
        <path d="M56 56 C60 53 65 54 68 58 M92 56 C96 53 101 54 104 58" fill="none" stroke={white} strokeLinecap="round" strokeWidth="2.3" opacity="0.55" />
      </g>
    );
  }

  if (id === 'star-glasses') {
    const star = 'M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z';
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d={star} transform="translate(62 63) scale(1.08)" fill={palette.accent} strokeWidth="2.6" />
        <path d={star} transform="translate(98 63) scale(1.08)" fill={palette.accent} strokeWidth="2.6" />
        <path d="M75 63 H85" stroke={ink} strokeLinecap="round" strokeWidth="3" />
      </g>
    );
  }

  if (id === 'eye-patch') {
    return (
      <g stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path d="M45 48 C68 57 92 63 116 79" fill="none" strokeWidth="3" />
        <path d="M84 57 C92 51 106 54 110 64 C106 75 91 77 84 68 Z" fill="#111827" strokeWidth="3" />
      </g>
    );
  }

  if (id === 'monocle') {
    return (
      <g stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 52 L77 55 L82 68 C72 76 55 74 49 65 Z" fill={lens} strokeWidth="3.5" />
        <path d="M83 68 L89 55 L116 52 L111 66 C104 75 91 76 83 68 Z" fill={lens} strokeWidth="3.5" />
        <path d="M77 59 H84 M42 52 H33 M118 52 H127" fill="none" strokeWidth="3.5" />
        <path d="M54 58 L70 55 M90 58 L106 55" fill="none" stroke={white} strokeWidth="2" opacity="0.42" />
      </g>
    );
  }

  return null;
}

function NeckAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  if (id === 'office-tie') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M71 88 H89 L84 101 H76 Z M76 101 L69 129 L80 140 L91 129 L84 101 Z" fill={palette.accent} strokeWidth="3" />
        <path d="M75 95 H85" stroke={white} strokeLinecap="round" strokeWidth="2" opacity="0.45" />
      </g>
    );
  }

  if (id === 'gold-chain') {
    return (
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M53 88 C66 103 94 103 107 88" fill="none" stroke="#FACC15" strokeWidth="4.8" />
        <path
          d="M80 100 L84 109 L93 110 L86 116 L88 125 L80 120 L72 125 L74 116 L67 110 L76 109 Z"
          fill="#FACC15"
          stroke={ink}
          strokeWidth="2.4"
        />
      </g>
    );
  }

  if (id === 'bow-tie') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M79 92 L56 81 V104 Z" fill={palette.accent} strokeWidth="3" />
        <path d="M81 92 L104 81 V104 Z" fill={palette.accent} strokeWidth="3" />
        <rect x="75" y="86" width="10" height="13" rx="3" fill={palette.secondary} strokeWidth="3" />
      </g>
    );
  }

  if (id === 'explorer-bandana') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M54 88 C68 99 92 99 106 88 L86 120 H74 Z" fill={palette.accent} strokeWidth="3.2" />
        <path d="M72 99 L80 107 L88 99" fill="none" stroke={white} strokeLinecap="round" strokeWidth="2.4" opacity="0.55" />
      </g>
    );
  }

  return null;
}

function BodyAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  if (id === 'pirate-sash') {
    return (
      <g stroke={ink} strokeLinejoin="round">
        <path d="M49 94 C73 104 95 119 111 139 L98 146 C82 122 62 109 43 103 Z" fill={palette.accent} strokeWidth="3.2" />
        <circle cx="77" cy="113" r="4.5" fill="#FACC15" strokeWidth="2.6" />
      </g>
    );
  }

  if (id === 'explorer-vest') {
    return (
      <g stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <path d="M43 94 C56 88 104 88 117 94 L109 141 C94 148 66 148 51 141 Z" fill="#EFF2F6" strokeWidth="3.5" />
        <path d="M47 96 L70 140 M113 96 L90 140" fill="none" strokeWidth="3.2" />
        <path d="M68 101 L80 130 L92 101" fill={palette.chest} strokeWidth="3.1" />
        <rect x="54" y="115" width="22" height="16" rx="3" fill="#D7DDE7" strokeWidth="2.8" />
        <rect x="84" y="115" width="22" height="16" rx="3" fill="#D7DDE7" strokeWidth="2.8" />
        <path d="M60 121 H71 M90 121 H101" fill="none" stroke={palette.accent} strokeWidth="2.2" opacity="0.75" />
      </g>
    );
  }

  if (id === 'gala-jacket') {
    return (
      <g stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <path d="M43 96 C56 90 104 90 117 96 L111 140 C95 148 65 148 49 140 Z" fill={white} strokeWidth="3.4" />
        <path d="M44 98 C54 101 64 108 72 122 L65 140 C57 139 51 137 48 134 Z" fill={palette.secondary} strokeWidth="3" />
        <path d="M116 98 C106 101 96 108 88 122 L95 140 C103 139 109 137 112 134 Z" fill={palette.secondary} strokeWidth="3" />
        <path d="M66 98 L80 129 L94 98" fill={white} strokeWidth="2.8" />
        <circle cx="80" cy="120" r="2.4" fill={ink} stroke="none" />
        <circle cx="80" cy="130" r="2.2" fill={ink} stroke="none" />
      </g>
    );
  }

  if (id === 'professor-cardigan') {
    return (
      <g stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <path d="M45 96 C58 90 102 90 115 96 L108 140 C93 148 67 148 52 140 Z" fill="#596270" strokeWidth="3.4" />
        <path d="M61 98 L80 128 L99 98 L92 140 H68 Z" fill={palette.chest} strokeWidth="3" />
        <path d="M61 112 L72 120 M99 112 L88 120" fill="none" stroke={white} strokeWidth="2.2" opacity="0.5" />
        <rect x="55" y="123" width="16" height="12" rx="3" fill="#D8DEE9" strokeWidth="2.5" />
        <rect x="89" y="123" width="16" height="12" rx="3" fill="#D8DEE9" strokeWidth="2.5" />
      </g>
    );
  }

  if (id === 'pop-jacket') {
    return (
      <g stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <path d="M45 94 C55 90 66 95 72 104 C77 96 83 96 88 104 C94 95 105 90 115 94 C116 119 102 140 80 146 C58 140 44 119 45 94 Z" fill={palette.chest} strokeWidth="3.3" />
        <path d="M50 110 C57 118 66 118 72 110 C77 119 83 119 88 110 C94 118 103 118 110 110" fill="none" stroke={palette.secondary} strokeWidth="3" opacity="0.44" />
        <path d="M42 99 C31 107 32 124 44 133 M118 99 C129 107 128 124 116 133" fill="none" stroke={palette.accent} strokeWidth="5.2" />
      </g>
    );
  }

  if (id === 'gamer-hoodie') {
    return (
      <g stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <path d="M46 98 C58 91 102 91 114 98 L108 140 C94 148 66 148 52 140 Z" fill="#1F2937" strokeWidth="3.3" />
        <path d="M61 99 L80 130 L99 99" fill={palette.chest} strokeWidth="3.1" />
        <path d="M80 104 V140" stroke={palette.accent} strokeWidth="3.2" />
        <path d="M68 112 L62 124 M92 112 L98 124" stroke={palette.accent} strokeWidth="2.4" opacity="0.72" />
      </g>
    );
  }

  return null;
}

function HandAccessory({ id, palette }: { id: PigeonAccessoryId; palette: PigeonAvatarPalette }) {
  if (id === 'game-controller') {
    return (
      <g transform="translate(105 109) rotate(9)" stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <path d="M0 9 C0 0 27 0 27 9 L31 22 C29 28 22 24 19 18 H8 C5 24 -2 28 -4 22 Z" fill="#111827" strokeWidth="3" />
        <path d="M7 10 H14 M10.5 6.5 V13.5" stroke={palette.accent} strokeWidth="2.5" />
        <circle cx="21" cy="9" r="2.2" fill={palette.accent} stroke="none" />
        <circle cx="26" cy="13" r="2.2" fill={palette.accent} stroke="none" />
      </g>
    );
  }

  if (id === 'lesson-book') {
    return (
      <g transform="translate(101 97) rotate(5)" stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <path d="M2 7 C12 3 23 5 31 10 L27 45 C18 41 9 41 -1 45 Z" fill={white} strokeWidth="3.3" />
        <path d="M31 10 C38 6 45 6 52 10 L48 45 C41 41 34 41 27 45 Z" fill={palette.chest} strokeWidth="3.3" />
        <path d="M30 10 L27 45" strokeWidth="2.5" />
        <path d="M-7 3 L0 0 L5 31 L0 35 Z" fill="#FACC15" strokeWidth="2.8" />
      </g>
    );
  }

  if (id === 'pop-microphone') {
    return (
      <g transform="translate(113 98) rotate(-20)" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
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
      <g transform="translate(15 76) rotate(-7)" stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <circle cx="21" cy="21" r="18.5" fill={white} strokeWidth="4.2" opacity="0.98" />
        <circle cx="21" cy="21" r="12" fill="#EEF2F7" strokeWidth="2.7" />
        <path d="M34 34 L53 53" fill="none" strokeWidth="6.5" />
        <path d="M21 11 L25 25 L21 31 L17 17 Z" fill={palette.accent} strokeWidth="2.4" />
      </g>
    );
  }

  if (id === 'gala-cane') {
    return (
      <g transform="translate(25 80) rotate(-8)" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3 H35 L29 28 C25 35 19 35 15 28 Z" fill={white} strokeWidth="3.3" />
        <path d="M15 14 H30" stroke={palette.accent} strokeWidth="4" />
        <path d="M22 31 V57" strokeWidth="4" />
        <path d="M13 58 H31" strokeWidth="4" />
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
      <g fill="none" stroke={white} strokeLinecap="round" strokeWidth="3" opacity="0.92">
        <path d="M27 45 L34 52 M34 45 L27 52 M124 48 L131 55 M131 48 L124 55 M121 98 L128 105 M128 98 L121 105" />
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
