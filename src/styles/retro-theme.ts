import { keyframes } from '@mui/material/styles'

export const retroColors = {
  cream: '#f5f0e6',
  creamDark: '#e8e0d0',
  warmGray: '#c8bfb0',
  warmGrayDark: '#a89e90',
  brown: '#4a3728',
  brownLight: '#6b5744',
  brownMid: '#5c4a3a',
  green: '#2d4a3e',
  greenLight: '#3a6050',
  greenBright: '#5a9a40',
  greenLed: '#7acc50',
  greenLedGlow: '#a0e870',
  red: '#8b3a3a',
  redLight: '#a85050',
  redLed: '#cc4444',
  redLedGlow: '#ff6666',
  text: '#3a2e24',
  textMuted: '#6b5e52',
  textDim: '#8a7e72',
  textLight: '#f5f0e6',
  panelBg: '#ede6d8',
  panelInset: '#ddd5c5',
  borderDark: '#8a7e72',
  borderMid: '#a89e90',
  borderLight: '#c8bfb0',
  highlight: 'rgba(255, 255, 250, 0.45)',
  insetShadow: 'rgba(60, 40, 20, 0.15)',
}

export const retroFonts = {
  mono: "'Courier New', 'Consolas', 'Monaco', 'Lucida Console', monospace",
  ui: "'Lucida Grande', 'Segoe UI', 'Helvetica Neue', Geneva, Verdana, sans-serif",
}

export const grainBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`

export const ledPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

export const retroSx = {
  sectionLabel: {
    fontFamily: retroFonts.mono,
    fontSize: 9,
    fontWeight: 700,
    color: retroColors.textDim,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '0 4px 4px',
    borderBottom: `1px solid ${retroColors.borderLight}`,
    userSelect: 'none' as const,
  },
  insetBox: {
    borderRadius: '3px',
    border: `1px solid ${retroColors.borderDark}`,
    background: `linear-gradient(180deg, #d0c8b8 0%, ${retroColors.panelInset} 3%, #e4ddd0 100%)`,
    boxShadow: `inset 0 1px 3px ${retroColors.insetShadow}, 0 1px 0 ${retroColors.highlight}`,
    padding: '8px 10px',
  },
  retroButton: {
    borderRadius: '4px',
    border: `1px solid ${retroColors.borderDark}`,
    background: `linear-gradient(180deg, #e8e0d0 0%, #d8d0c0 40%, #ccc4b4 100%)`,
    boxShadow: `inset 0 1px 0 ${retroColors.highlight}, 0 2px 4px ${retroColors.insetShadow}, 0 1px 0 rgba(255,255,250,0.3)`,
    fontFamily: retroFonts.ui,
    fontSize: 11,
    fontWeight: 600,
    color: retroColors.text,
    letterSpacing: '0.02em',
    textShadow: `0 1px 0 rgba(255,255,255,0.5)`,
    textTransform: 'none' as const,
    '&:hover': {
      background: `linear-gradient(180deg, #f0e8d8 0%, #e0d8c8 40%, #d4ccbc 100%)`,
      borderColor: retroColors.brownLight,
    },
    '&:active': {
      background: `linear-gradient(180deg, #c8c0b0 0%, #d0c8b8 60%, #d8d0c0 100%)`,
      boxShadow: `inset 0 2px 4px ${retroColors.insetShadow}, 0 1px 0 ${retroColors.highlight}`,
    },
  },
  retroButtonContained: {
    borderRadius: '4px',
    border: `1px solid #3a6830`,
    background: `linear-gradient(180deg, #5a9a40 0%, #4a8a30 40%, #3a7a28 100%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px ${retroColors.insetShadow}`,
    fontFamily: retroFonts.ui,
    fontSize: 11,
    fontWeight: 600,
    color: '#f5f0e6',
    letterSpacing: '0.02em',
    textTransform: 'none' as const,
    '&:hover': {
      background: `linear-gradient(180deg, #6aaa50 0%, #5a9a40 40%, #4a8a30 100%)`,
      borderColor: '#2a5820',
    },
  },
  retroSelect: {
    fontFamily: retroFonts.mono,
    fontSize: 10,
    color: retroColors.text,
    borderRadius: '3px',
    border: `1px solid ${retroColors.borderDark}`,
    background: `linear-gradient(180deg, #e8e0d0 0%, ${retroColors.panelInset} 100%)`,
    boxShadow: `inset 0 1px 0 ${retroColors.highlight}`,
    '& .MuiSelect-select': {
      padding: '4px 8px',
    },
  },
  retroInput: {
    fontFamily: retroFonts.mono,
    fontSize: 11,
    color: retroColors.text,
    borderRadius: '3px',
    border: `1px solid ${retroColors.borderDark}`,
    background: `linear-gradient(180deg, #d0c8b8 0%, ${retroColors.panelInset} 3%, #e4ddd0 100%)`,
    boxShadow: `inset 0 1px 3px ${retroColors.insetShadow}, 0 1px 0 ${retroColors.highlight}`,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& input': {
      padding: '6px 10px',
      fontFamily: retroFonts.mono,
      fontSize: 11,
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
    padding: '3px 0',
    '& + &': {
      borderTop: `1px dotted ${retroColors.borderLight}`,
    },
  },
  statusKey: {
    fontFamily: retroFonts.mono,
    fontSize: 9,
    fontWeight: 400,
    color: retroColors.textMuted,
    userSelect: 'none' as const,
    letterSpacing: '0.04em',
  },
  statusVal: {
    fontFamily: retroFonts.mono,
    fontSize: 9,
    fontWeight: 700,
    color: retroColors.text,
    userSelect: 'none' as const,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '14px 12px',
    gap: '10px',
    background: `linear-gradient(180deg, ${retroColors.creamDark} 0%, #d8d0c0 100%)`,
    backgroundImage: grainBg,
  },
  card: {
    borderRadius: '4px',
    border: `1px solid ${retroColors.borderMid}`,
    background: `linear-gradient(180deg, ${retroColors.creamDark} 0%, #d8d0c0 100%)`,
    boxShadow: `inset 0 1px 0 ${retroColors.highlight}, 0 2px 6px ${retroColors.insetShadow}`,
    padding: '12px',
  },
}
