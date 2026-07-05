export const iconPaths = {
  'arrow-right':
    'M5 12h14m0 0-4-4m4 4-4 4',
  check: 'M5 13l4 4L19 7',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  search: 'M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm10 14-4.3-4.3',
  sun: 'M12 4V2m0 18v-2M4.93 4.93 3.52 3.52m16.96 16.96-1.41-1.41M4 12H2m20 0h-2M4.93 19.07 3.52 20.48m16.96-16.96-1.41 1.41M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
} as const;

export type IconName = keyof typeof iconPaths;

export const iconNames = Object.keys(iconPaths) as IconName[];
