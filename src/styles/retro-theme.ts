import { keyframes } from '@mui/material/styles'

export const retroColors = {
  // Surfaces
  cream: '#ffffff',
  creamDark: '#f8fafc',
  warmGray: '#e2e8f0',
  warmGrayDark: '#cbd5e1',

  // Browns → Slate dark
  brown: '#1e293b',
  brownLight: '#334155',
  brownMid: '#475569',

  // Greens → Modern success
  green: '#059669',
  greenLight: '#10b981',
  greenBright: '#34d399',
  greenLed: '#10b981',
  greenLedGlow: '#6ee7b7',

  // Reds → Modern error
  red: '#dc2626',
  redLight: '#ef4444',
  redLed: '#ef4444',
  redLedGlow: '#fca5a5',

  // Text
  text: '#0f172a',
  textMuted: '#64748b',
  textDim: '#94a3b8',
  textLight: '#ffffff',

  // Panel
  panelBg: '#f8fafc',
  panelInset: '#f1f5f9',

  // Borders
  borderDark: '#cbd5e1',
  borderMid: '#e2e8f0',
  borderLight: '#f1f5f9',

  // Effects
  highlight: 'rgba(255, 255, 255, 0.8)',
  insetShadow: 'rgba(0, 0, 0, 0.04)',

  // Accent (indigo)
  accent: '#6366f1',
  accentLight: '#818cf8',
  accentSubtle: '#eef2ff',
}

export const retroFonts = {
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  ui: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
}

export const grainBg = 'none'

export const ledPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

export const retroSx = {
  sectionLabel: {
    fontFamily: retroFonts.ui,
    fontSize: 11,
    fontWeight: 600,
    color: retroColors.textMuted,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
    padding: '0 0 8px',
    borderBottom: `1px solid ${retroColors.borderMid}`,
    userSelect: 'none' as const,
  },
  insetBox: {
    borderRadius: '8px',
    border: `1px solid ${retroColors.borderMid}`,
    background: retroColors.cream,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    padding: '12px 14px',
  },
  retroButton: {
    borderRadius: '8px',
    border: `1px solid ${retroColors.borderMid}`,
    background: retroColors.cream,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    fontFamily: retroFonts.ui,
    fontSize: 13,
    fontWeight: 500,
    color: retroColors.text,
    letterSpacing: '0',
    textTransform: 'none' as const,
    '&:hover': {
      background: retroColors.creamDark,
      borderColor: retroColors.warmGrayDark,
    },
    '&:active': {
      background: retroColors.warmGray,
    },
  },
  retroButtonContained: {
    borderRadius: '8px',
    border: 'none',
    background: retroColors.accent,
    boxShadow: '0 1px 3px rgba(99, 102, 241, 0.3)',
    fontFamily: retroFonts.ui,
    fontSize: 13,
    fontWeight: 500,
    color: '#ffffff',
    letterSpacing: '0',
    textTransform: 'none' as const,
    '&:hover': {
      background: retroColors.accentLight,
    },
  },
  retroSelect: {
    fontFamily: retroFonts.ui,
    fontSize: 13,
    color: retroColors.text,
    borderRadius: '8px',
    border: `1px solid ${retroColors.borderMid}`,
    background: retroColors.cream,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    '& .MuiSelect-select': {
      padding: '8px 12px',
    },
  },
  retroInput: {
    fontFamily: retroFonts.ui,
    fontSize: 13,
    color: retroColors.text,
    borderRadius: '8px',
    border: `1px solid ${retroColors.borderMid}`,
    background: retroColors.cream,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& input': {
      padding: '8px 12px',
      fontFamily: retroFonts.ui,
      fontSize: 13,
      color: retroColors.text,
    },
    '& input::placeholder': {
      color: retroColors.textDim,
      opacity: 1,
    },
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 0',
    '& + &': {
      borderTop: `1px solid ${retroColors.borderLight}`,
    },
  },
  statusKey: {
    fontFamily: retroFonts.ui,
    fontSize: 12,
    fontWeight: 400,
    color: retroColors.textMuted,
    userSelect: 'none' as const,
  },
  statusVal: {
    fontFamily: retroFonts.mono,
    fontSize: 12,
    fontWeight: 600,
    color: retroColors.text,
    userSelect: 'none' as const,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '16px',
    gap: '12px',
    background: retroColors.cream,
  },
  card: {
    borderRadius: '12px',
    border: `1px solid ${retroColors.borderMid}`,
    background: retroColors.cream,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    padding: '16px',
  },
}
