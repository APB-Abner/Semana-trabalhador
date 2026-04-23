const toneStyles = {
  green: {
    bar: 'bg-green-500',
    badge: 'bg-green-600 text-white',
    card: 'border-green-500 bg-green-50 text-green-950 dark:bg-green-950/50 dark:text-green-100',
  },
  amber: {
    bar: 'bg-amber-500',
    badge: 'bg-amber-500 text-amber-950',
    card: 'border-amber-500 bg-amber-50 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100',
  },
  red: {
    bar: 'bg-red-500',
    badge: 'bg-red-600 text-white',
    card: 'border-red-400 bg-red-50 text-red-950 dark:bg-red-950/50 dark:text-red-100',
  },
  blue: {
    bar: 'bg-blue-500',
    badge: 'bg-blue-600 text-white',
    card: 'border-blue-500 bg-blue-50 text-blue-950 dark:bg-blue-950/50 dark:text-blue-100',
  },
  gray: {
    bar: 'bg-gray-400 dark:bg-zinc-500',
    badge: 'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-100',
    card: 'border-gray-200 bg-white text-gray-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100',
  },
};

export function getRevealOptionCardClass(tone = 'gray', selected = false) {
  const style = toneStyles[tone] ?? toneStyles.gray;
  const selectedClass = selected ? 'ring-2 ring-blue-400/60 dark:ring-blue-300/50' : '';

  return `${style.card} ${selectedClass}`;
}

export function getRevealBadgeClass(tone = 'gray') {
  return toneStyles[tone]?.badge ?? toneStyles.gray.badge;
}

export function getRevealBarClass(tone = 'gray') {
  return toneStyles[tone]?.bar ?? toneStyles.gray.bar;
}
