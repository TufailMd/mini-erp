export const colors = {
  primary: '#2563EB',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
};

export const typography = {
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
  headingWeight: 700,
  bodyWeight: 400,
};

export function cssVars() {
  return {
    '--color-primary': colors.primary,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-danger': colors.danger,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-text-primary': colors.textPrimary,
    '--color-text-secondary': colors.textSecondary,
    '--font-family-base': typography.fontFamily,
    '--font-family-mono': typography.mono,
  } as Record<string, string>;
}

export default {
  colors,
  typography,
  cssVars,
};
