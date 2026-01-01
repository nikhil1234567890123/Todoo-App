/**
 * Design System for Todo App
 * Modern, production-grade theme with extended tokens
 */

import { Platform } from 'react-native';

// Base colors
const palette = {
  // Primary
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',

  // Neutrals
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#020617',

  // Priority Colors
  red400: '#F87171',
  red500: '#EF4444',
  red600: '#DC2626',
  orange400: '#FB923C',
  orange500: '#F97316',
  green400: '#4ADE80',
  green500: '#22C55E',
  green600: '#16A34A',

  // Accent
  amber400: '#FBBF24',
  amber500: '#F59E0B',

  // Status
  white: '#FFFFFF',
  black: '#000000',
};

// Priority color mappings
export const PriorityColors = {
  high: {
    bg: '#FEE2E2',
    text: palette.red600,
    dot: palette.red500,
  },
  medium: {
    bg: '#FEF3C7',
    text: '#D97706',
    dot: palette.orange500,
  },
  low: {
    bg: '#DCFCE7',
    text: palette.green600,
    dot: palette.green500,
  },
};

export const Colors = {
  light: {
    // Core
    text: palette.slate900,
    textSecondary: palette.slate500,
    textTertiary: palette.slate400,
    background: palette.slate50,
    surface: palette.white,
    surfaceSecondary: palette.slate100,

    // Interactive
    tint: palette.indigo600,
    tintLight: palette.indigo100,

    // Borders
    border: palette.slate200,
    borderFocused: palette.indigo500,

    // Icons
    icon: palette.slate500,
    iconActive: palette.indigo600,
    tabIconDefault: palette.slate400,
    tabIconSelected: palette.indigo600,

    // Status
    success: palette.green500,
    successBg: '#DCFCE7',
    error: palette.red500,
    errorBg: '#FEE2E2',
    warning: palette.amber500,
    warningBg: '#FEF3C7',

    // Shadows (for iOS)
    shadowColor: palette.black,
  },
  dark: {
    // Core
    text: palette.slate100,
    textSecondary: palette.slate400,
    textTertiary: palette.slate500,
    background: palette.slate950,
    surface: palette.slate900,
    surfaceSecondary: palette.slate800,

    // Interactive
    tint: palette.indigo500,
    tintLight: palette.indigo700,

    // Borders
    border: palette.slate700,
    borderFocused: palette.indigo500,

    // Icons
    icon: palette.slate400,
    iconActive: palette.indigo500,
    tabIconDefault: palette.slate500,
    tabIconSelected: palette.indigo500,

    // Status
    success: palette.green400,
    successBg: '#166534',
    error: palette.red400,
    errorBg: '#991B1B',
    warning: palette.amber400,
    warningBg: '#92400E',

    // Shadows
    shadowColor: palette.black,
  },
};

// Spacing scale (4px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// Border radius
export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

// Typography
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Fonts
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Shadows
export const Shadows = {
  sm: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Animation timings (in ms)
export const Animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};
