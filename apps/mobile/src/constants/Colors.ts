/** Netrak's intentionally small, role-neutral visual vocabulary. */
export const Colors = {
  light: {
    tint: '#49D5E8',
    background: '#0A0B0D',
    surface: '#141518',
    surfaceMuted: '#1B1D21',
    text: '#F5F7F8',
    muted: '#989DA5',
    border: 'rgba(255,255,255,0.09)',
    success: '#72B88B',
    warning: '#C9A66B',
    danger: '#C97575',
    onDanger: '#FFFFFF',
    controlThumb: '#FFFFFF',
    info: '#49D5E8',
    violet: '#A5A7F6',
  },
  dark: {
    tint: '#49D5E8', background: '#0A0B0D', surface: '#141518', surfaceMuted: '#1B1D21',
    text: '#F5F7F8', muted: '#989DA5', border: 'rgba(255,255,255,0.09)',
    success: '#72B88B', warning: '#C9A66B', danger: '#C97575', info: '#49D5E8', violet: '#A5A7F6',
    onDanger: '#FFFFFF', controlThumb: '#FFFFFF',
  },
  primary: '#49D5E8', secondary: '#49D5E8', background: '#0A0B0D', text: '#F5F7F8',
};

/** Use these where a screen supports both appearance modes at render time. */
export const ThemePalette = {
  dark: Colors.dark,
  light: {
    tint: '#009BCB',
    background: '#F7F8FA',
    surface: '#FFFFFF',
    surfaceMuted: '#EFF2F5',
    text: '#14161A',
    muted: '#626976',
    border: 'rgba(20,22,26,0.10)',
    success: '#16803D',
    warning: '#B86E00',
    danger: '#BE3434',
    onDanger: '#FFFFFF',
    controlThumb: '#FFFFFF',
    info: '#009BCB',
    violet: '#5A5FAE',
  },
};
