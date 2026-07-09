import { useMemo } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useThemeStore } from '@/store/themeStore';

export function useAppTheme() {
  const { isDarkMode } = useThemeStore();

  return useMemo(() => {
    const paperTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;
    const colors = paperTheme.colors;

    return { paperTheme, colors, isDarkMode };
  }, [isDarkMode]);
}
