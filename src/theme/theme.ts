import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors } from './colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    outline: colors.muted,
    error: colors.error
  }
};

export default theme;
