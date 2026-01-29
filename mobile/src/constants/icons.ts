export const AppIcons = {
  truck: 'truck-fast',
  play: 'play-circle',
  stop: 'stop-circle',
  location: 'map-marker',
  logout: 'logout',
  user: 'account-circle',
  eyeOn: 'eye',
  eyeOff: 'eye-off',
} as const;

export type IconName = typeof AppIcons[keyof typeof AppIcons];
