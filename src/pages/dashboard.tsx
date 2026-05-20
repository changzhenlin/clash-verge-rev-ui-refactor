import DnsRounded from '@mui/icons-material/DnsRounded'
import ForkRightRounded from '@mui/icons-material/ForkRightRounded'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import SubjectRounded from '@mui/icons-material/SubjectRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import { Box, ButtonBase, Typography } from '@mui/material'
import { keyframes, styled } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { useSystemProxyState } from '@/hooks/use-system-proxy-state'

type MenuItem = {
  icon: typeof WifiRounded
  labelKey: string
  path: string
}

const menuItems: MenuItem[] = [
  {
    icon: ForkRightRounded,
    labelKey: 'layout.components.navigation.tabs.rules',
    path: '/rules',
  },
  {
    icon: DnsRounded,
    labelKey: 'layout.components.navigation.tabs.profiles',
    path: '/profiles',
  },
  {
    icon: LanguageRounded,
    labelKey: 'layout.components.navigation.tabs.connections',
    path: '/connections',
  },
  {
    icon: SettingsRounded,
    labelKey: 'layout.components.navigation.tabs.settings',
    path: '/settings',
  },
  {
    icon: WifiRounded,
    labelKey: 'layout.components.navigation.tabs.proxies',
    path: '/proxies',
  },
  {
    icon: SubjectRounded,
    labelKey: 'layout.components.navigation.tabs.logs',
    path: '/logs',
  },
]

const c = {
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

const font =
  "'Courier New', 'Consolas', 'Monaco', 'Lucida Console', monospace"
const fontUI =
  "'Lucida Grande', 'Segoe UI', 'Helvetica Neue', Geneva, Verdana, sans-serif"

const grainBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`

const ledPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const Shell = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: fontUI,
  fontSize: 11,
  color: c.text,
  background: `${c.panelBg}`,
  backgroundImage: grainBg,
  overflow: 'hidden',
  WebkitFontSmoothing: 'antialiased',
})

const TitleBar = styled(Box)({
  height: 36,
  minHeight: 36,
  display: 'flex',
  alignItems: 'center',
  padding: '0 14px',
  gap: 10,
  background: `linear-gradient(180deg, ${c.brownLight} 0%, ${c.brown} 100%)`,
  borderBottom: `1px solid #2a1e14`,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.2)`,
  position: 'relative',
})

const TitleText = styled(Typography)({
  fontFamily: font,
  fontSize: 12,
  fontWeight: 700,
  color: c.cream,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  userSelect: 'none',
  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
})

const TitleSpacer = styled(Box)({ flex: 1 })

const StatusBadge = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '2px 10px',
  borderRadius: 2,
  fontSize: 9,
  fontWeight: 700,
  fontFamily: font,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: active ? '#d4ecc0' : '#e8c8b0',
  background: active
    ? 'linear-gradient(180deg, #3a6050 0%, #2d4a3e 100%)'
    : 'linear-gradient(180deg, #6b4040 0%, #5a3030 100%)',
  border: `1px solid ${active ? '#1a3028' : '#3a1818'}`,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.2)`,
  userSelect: 'none',
}))

const Body = styled(Box)({
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '180px 1fr 220px',
  overflow: 'hidden',
  background: c.panelBg,
  backgroundImage: grainBg,
})

const StatusPanel = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '14px 12px',
  gap: 10,
  background: `linear-gradient(180deg, ${c.creamDark} 0%, #d8d0c0 100%)`,
  backgroundImage: grainBg,
  borderRight: `1px solid ${c.borderMid}`,
  boxShadow: `inset -1px 0 0 ${c.highlight}`,
})

const SectionLabel = styled(Typography)({
  fontFamily: font,
  fontSize: 9,
  fontWeight: 700,
  color: c.textDim,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  padding: '0 4px 4px',
  borderBottom: `1px solid ${c.borderLight}`,
  userSelect: 'none',
})

const InsetBox = styled(Box)({
  borderRadius: 3,
  border: `1px solid ${c.borderDark}`,
  background: `linear-gradient(180deg, #d0c8b8 0%, ${c.panelInset} 3%, #e4ddd0 100%)`,
  boxShadow: `inset 0 1px 3px ${c.insetShadow}, 0 1px 0 ${c.highlight}`,
  padding: '8px 10px',
})

const StatusRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '3px 0',
  '& + &': {
    borderTop: `1px dotted ${c.borderLight}`,
  },
})

const StatusKey = styled(Typography)({
  fontFamily: font,
  fontSize: 9,
  fontWeight: 400,
  color: c.textMuted,
  userSelect: 'none',
  letterSpacing: '0.04em',
})

const StatusVal = styled(Typography)({
  fontFamily: font,
  fontSize: 9,
  fontWeight: 700,
  color: c.text,
  userSelect: 'none',
})

const Led = styled(Box, {
  shouldForwardProp: (p) => p !== 'active' && p !== 'color',
})<{ active: boolean; color?: 'green' | 'red' }>(
  ({ active, color = 'green' }) => {
    const onColor = color === 'green' ? c.greenLed : c.redLed
    const glowColor = color === 'green' ? c.greenLedGlow : c.redLedGlow
    const borderColor = color === 'green' ? '#3a6830' : '#6a2828'
    return {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: active
        ? `radial-gradient(circle at 40% 35%, ${glowColor}, ${onColor})`
        : `radial-gradient(circle at 40% 35%, #bbb5a8, #9a9488)`,
      boxShadow: active
        ? `0 0 6px ${glowColor}, 0 0 12px ${glowColor}40, inset 0 1px 1px rgba(255,255,255,0.4)`
        : `inset 0 1px 2px rgba(0,0,0,0.2)`,
      border: `1px solid ${active ? borderColor : '#7a7268'}`,
      transition: 'all 0.3s',
      animation: active ? `${ledPulse} 3s ease-in-out infinite` : 'none',
      flexShrink: 0,
    }
  },
)

const VUMeterBar = styled(Box)({
  display: 'flex',
  gap: 2,
  alignItems: 'flex-end',
  height: 14,
})

const VUSegment = styled(Box, {
  shouldForwardProp: (p) => p !== 'active' && p !== 'level',
})<{ active: boolean; level: number }>(({ active, level }) => ({
  width: 3,
  height: `${30 + level * 10}%`,
  borderRadius: 1,
  background: active
    ? level > 5
      ? c.red
      : level > 3
        ? '#b89030'
        : c.greenBright
    : '#c8c0b0',
  border: `1px solid ${
    active
      ? level > 5
        ? '#6a2828'
        : level > 3
          ? '#8a6820'
          : '#3a6830'
      : '#a89e90'
  }`,
  boxShadow: active
    ? `inset 0 1px 0 rgba(255,255,255,0.3)`
    : 'none',
  transition: 'all 0.3s',
}))

const CenterPanel = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  padding: 24,
  position: 'relative',
  background: c.panelBg,
  backgroundImage: grainBg,
})

const SwitchBase = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  width: 140,
  height: 200,
  borderRadius: 8,
  border: `2px solid ${active ? '#2a5a30' : '#6a3030'}`,
  background: active
    ? `linear-gradient(180deg, #d8e8d0 0%, #c8d8c0 50%, #b8c8b0 100%)`
    : `linear-gradient(180deg, #e0d0c8 0%, #d0c0b8 50%, #c8b8b0 100%)`,
  boxShadow: active
    ? [
        `inset 0 2px 4px rgba(255,255,255,0.3)`,
        `inset 0 -2px 4px rgba(40, 80, 40, 0.1)`,
        `0 4px 16px rgba(90, 154, 64, 0.25)`,
        `0 0 24px rgba(90, 154, 64, 0.1)`,
        `0 1px 3px rgba(60, 40, 20, 0.15)`,
      ].join(',')
    : [
        `inset 0 2px 4px rgba(255,255,255,0.3)`,
        `inset 0 -2px 4px rgba(80, 40, 40, 0.1)`,
        `0 4px 12px rgba(139, 58, 58, 0.15)`,
        `0 1px 3px rgba(60, 40, 20, 0.15)`,
      ].join(','),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 0',
  position: 'relative',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease',
  '&:active': {
    boxShadow: [
      `inset 0 2px 6px ${c.insetShadow}`,
      `0 2px 6px rgba(60, 40, 20, 0.15)`,
    ].join(','),
  },
}))

const LeverTrack = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  width: 48,
  height: 120,
  borderRadius: 24,
  border: `2px solid ${active ? '#3a6830' : '#6a3828'}`,
  background: active
    ? `linear-gradient(180deg, #4a7a40 0%, #3a6830 50%, #2a5820 100%)`
    : `linear-gradient(180deg, #7a5848 0%, #6a4838 50%, #5a3828 100%)`,
  boxShadow: active
    ? `inset 0 3px 8px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.1), 0 0 12px rgba(90,154,64,0.2)`
    : `inset 0 3px 8px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.1)`,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
}))

const LeverHandle = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: active
    ? `radial-gradient(circle at 40% 35%, #e8e0d0 0%, #c8c0b0 60%, #b0a898 100%)`
    : `radial-gradient(circle at 40% 35%, #d8d0c0 0%, #b8b0a0 60%, #a09888 100%)`,
  border: `2px solid ${active ? '#8a7e68' : '#7a7060'}`,
  boxShadow: [
    `0 2px 6px rgba(0,0,0,0.25)`,
    `inset 0 2px 3px rgba(255,255,255,0.4)`,
    `inset 0 -1px 2px rgba(0,0,0,0.1)`,
  ].join(','),
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  top: active ? 6 : 'calc(100% - 46px)',
  transition: 'top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s ease, border-color 0.4s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '15%',
    left: '22%',
    width: '30%',
    height: '20%',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.35)',
    filter: 'blur(3px)',
    pointerEvents: 'none',
  },
}))

const SwitchLabel = styled(Typography, {
  shouldForwardProp: (p) => p !== 'placement' && p !== 'lit',
})<{ placement: 'top' | 'bottom'; lit?: boolean }>(({ placement, lit }) => ({
  fontFamily: font,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: lit ? (placement === 'top' ? c.greenBright : c.red) : c.textDim,
  textShadow: lit ? `0 0 6px ${placement === 'top' ? 'rgba(90,154,64,0.4)' : 'rgba(139,58,58,0.4)'}` : 'none',
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  ...(placement === 'top'
    ? { top: 8 }
    : { bottom: 8 }),
  userSelect: 'none',
  transition: 'color 0.4s ease, text-shadow 0.4s ease',
}))

const ButtonGrid = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '14px 14px',
  gap: 10,
  background: `linear-gradient(180deg, ${c.creamDark} 0%, #d8d0c0 100%)`,
  backgroundImage: grainBg,
  borderLeft: `1px solid ${c.borderMid}`,
  boxShadow: `inset 1px 0 0 ${c.highlight}`,
})

const GridContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  flex: 1,
  alignContent: 'center',
})

const RetroButton = styled(ButtonBase)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '14px 8px',
  borderRadius: 4,
  border: `1px solid ${c.borderDark}`,
  background: `linear-gradient(180deg, #e8e0d0 0%, #d8d0c0 40%, #ccc4b4 100%)`,
  boxShadow: [
    `inset 0 1px 0 ${c.highlight}`,
    `0 2px 4px ${c.insetShadow}`,
    `0 1px 0 rgba(255,255,250,0.3)`,
  ].join(','),
  fontFamily: fontUI,
  fontSize: 10,
  fontWeight: 600,
  color: c.text,
  letterSpacing: '0.02em',
  textShadow: `0 1px 0 rgba(255,255,255,0.5)`,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'none',
  '&:hover': {
    background: `linear-gradient(180deg, #f0e8d8 0%, #e0d8c8 40%, #d4ccbc 100%)`,
    borderColor: c.brownLight,
  },
  '&:active': {
    background: `linear-gradient(180deg, #c8c0b0 0%, #d0c8b8 60%, #d8d0c0 100%)`,
    boxShadow: `inset 0 2px 4px ${c.insetShadow}, 0 1px 0 ${c.highlight}`,
    transform: 'translateY(1px)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
    color: c.brownLight,
  },
})

const FooterBar = styled(Box)({
  height: 24,
  minHeight: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 14px',
  background: `linear-gradient(180deg, ${c.warmGray} 0%, ${c.warmGrayDark} 100%)`,
  borderTop: `1px solid ${c.borderDark}`,
  boxShadow: `inset 0 1px 0 ${c.highlight}`,
  fontSize: 9,
  fontFamily: font,
  color: c.textDim,
  letterSpacing: '0.04em',
  userSelect: 'none',
})

const DashboardPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { indicator, toggleSystemProxy } = useSystemProxyState()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const handleToggleProxy = useCallback(() => {
    toggleSystemProxy(!indicator)
  }, [indicator, toggleSystemProxy])

  const timeLabel = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(now)

  return (
    <Shell>
      {/* Title Bar */}
      <TitleBar data-tauri-drag-region>
        <Led active={indicator} />
        <TitleText>Clash Verge</TitleText>
        <TitleSpacer data-tauri-drag-region />
        <StatusBadge active={indicator}>
          {indicator ? '● ONLINE' : '○ OFFLINE'}
        </StatusBadge>
        <Typography
          sx={{
            fontFamily: font,
            fontSize: 9,
            color: 'rgba(245,240,230,0.5)',
            letterSpacing: '0.08em',
          }}
        >
          {timeLabel}
        </Typography>
      </TitleBar>

      {/* Body */}
      <Body>
        {/* Left: Status Panel */}
        <StatusPanel>
          <SectionLabel>System Status</SectionLabel>

          <InsetBox>
            <StatusRow>
              <StatusKey>STATUS</StatusKey>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Led active={indicator} color={indicator ? 'green' : 'red'} />
                <StatusVal>
                  {indicator ? 'Connected' : 'Disconnected'}
                </StatusVal>
              </Box>
            </StatusRow>
            <StatusRow>
              <StatusKey>MODE</StatusKey>
              <StatusVal>{indicator ? 'Sys Proxy' : 'Direct'}</StatusVal>
            </StatusRow>
            <StatusRow>
              <StatusKey>ROUTE</StatusKey>
              <StatusVal>{indicator ? 'Global' : '—'}</StatusVal>
            </StatusRow>
            <StatusRow>
              <StatusKey>DATE</StatusKey>
              <StatusVal>{dateLabel}</StatusVal>
            </StatusRow>
          </InsetBox>

          <SectionLabel>Signal Meter</SectionLabel>

          <InsetBox>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <StatusKey>LEVEL</StatusKey>
              <VUMeterBar>
                {Array.from({ length: 7 }, (_, i) => (
                  <VUSegment key={i} active={indicator} level={i} />
                ))}
              </VUMeterBar>
            </Box>
          </InsetBox>

          <SectionLabel>Indicators</SectionLabel>

          <InsetBox>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {[
                { label: 'PROXY', on: indicator },
                { label: 'TUN', on: false },
                { label: 'DNS', on: indicator },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <StatusKey>{item.label}</StatusKey>
                  <Led active={item.on} color={item.on ? 'green' : 'red'} />
                </Box>
              ))}
            </Box>
          </InsetBox>
        </StatusPanel>

        {/* Center: Main Switch */}
        <CenterPanel data-tauri-drag-region>
          <Typography
            sx={{
              fontFamily: font,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: c.textDim,
            }}
          >
            System Proxy Control
          </Typography>

          <SwitchBase active={indicator} onClick={handleToggleProxy}>
            <SwitchLabel placement="top" lit={indicator}>ON</SwitchLabel>
            <LeverTrack active={indicator}>
              <LeverHandle active={indicator} />
            </LeverTrack>
            <SwitchLabel placement="bottom" lit={!indicator}>OFF</SwitchLabel>
          </SwitchBase>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Led active={indicator} color={indicator ? 'green' : 'red'} />
            <Typography
              sx={{
                fontFamily: font,
                fontSize: 15,
                fontWeight: 700,
                color: indicator ? '#3a8a28' : '#a04040',
                letterSpacing: '0.2em',
                textShadow: indicator
                  ? '0 0 8px rgba(90,154,64,0.3)'
                  : '0 0 8px rgba(160,64,64,0.2)',
                transition: 'color 0.4s ease, text-shadow 0.4s ease',
              }}
            >
              {indicator ? 'ONLINE' : 'OFFLINE'}
            </Typography>
            <Led active={indicator} color={indicator ? 'green' : 'red'} />
          </Box>

          <InsetBox sx={{ maxWidth: 200, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <PowerSettingsNewRounded
                sx={{
                  fontSize: 14,
                  color: indicator ? c.greenBright : c.textDim,
                }}
              />
              <Typography
                sx={{
                  fontFamily: font,
                  fontSize: 9,
                  color: c.textMuted,
                  letterSpacing: '0.06em',
                }}
              >
                {indicator
                  ? 'Proxy engine running'
                  : 'Flip switch to connect'}
              </Typography>
            </Box>
          </InsetBox>
        </CenterPanel>

        {/* Right: Function Buttons */}
        <ButtonGrid>
          <SectionLabel>Control Panel</SectionLabel>

          <GridContainer>
            {menuItems.map((item) => {
              const label = t(item.labelKey)
              return (
                <RetroButton
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  aria-label={label}
                >
                  <item.icon />
                  {label}
                </RetroButton>
              )
            })}
          </GridContainer>
        </ButtonGrid>
      </Body>

      {/* Footer */}
      <FooterBar>
        <span>
          {indicator ? '● System proxy active' : '○ Direct connection'}
        </span>
        <span>Clash Verge Rev v2.4</span>
      </FooterBar>
    </Shell>
  )
}

export default DashboardPage
