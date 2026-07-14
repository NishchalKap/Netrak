import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { ThemePalette } from '@/constants';
import { useThemeStore } from '@/store/themeStore';

export function useAppTheme() {
  const mode = useThemeStore((state) => state.mode);
  const systemMode = useColorScheme();
  const isDarkMode = mode === 'system' ? systemMode !== 'light' : mode === 'dark';
  return useMemo(() => {
    const colors = isDarkMode ? ThemePalette.dark : ThemePalette.light;
    const baseTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;
    return {
    isDarkMode,
    colors,
    paperTheme: {
      ...baseTheme,
      colors: { ...baseTheme.colors, primary: colors.tint, background: colors.background, surface: colors.surface, onSurface: colors.text, outline: colors.border },
    },
  };
  }, [isDarkMode]);
}
