import DnsRounded from '@mui/icons-material/DnsRounded'
import ForkRightRounded from '@mui/icons-material/ForkRightRounded'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import SubjectRounded from '@mui/icons-material/SubjectRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import { Box, ButtonBase, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
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
  toolbarTop: '#c8c8c8',
  toolbarBot: '#a0a0a0',
  toolbarBorder: '#888',
  panelBg: '#ececec',
  panelInset: '#e0e0e0',
  sidebarBg: '#e4e4e4',
  border: '#b0b0b0',
  borderLight: '#c8c8c8',
  borderDark: '#999',
  text: '#333',
  textMuted: '#666',
  textDim: '#888',
  white: '#fff',
  insetShadow: 'rgba(0,0,0,0.12)',
  highlight: 'rgba(255,255,255,0.65)',
  greenOn: '#65b045',
  greenGlow: '#8cd070',
  redOff: '#cc5544',
  ledOff: '#999',
}

const font = "'Lucida Grande', 'Helvetica Neue', Geneva, Verdana, sans-serif"

const Shell = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: font,
  fontSize: 11,
  color: c.text,
  background: c.panelBg,
  overflow: 'hidden',
  WebkitFontSmoothing: 'antialiased',
})

const Toolbar = styled(Box)({
  height: 32,
  minHeight: 32,
  display: 'flex',
  alignItems: 'center',
  padding: '0 12px',
  gap: 8,
  background: `linear-gradient(180deg, ${c.toolbarTop} 0%, ${c.toolbarBot} 100%)`,
  borderBottom: `1px solid ${c.toolbarBorder}`,
  boxShadow: `inset 0 1px 0 ${c.highlight}`,
  position: 'relative',
})

const ToolbarTitle = styled(Typography)({
  fontFamily: font,
  fontSize: 11,
  fontWeight: 700,
  color: c.text,
  letterSpacing: '0.02em',
  userSelect: 'none',
  textShadow: `0 1px 0 rgba(255,255,255,0.5)`,
})

const ToolbarSpacer = styled(Box)({ flex: 1 })

const ToolbarBadge = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 8px',
  borderRadius: 3,
  fontSize: 10,
  fontWeight: 600,
  fontFamily: font,
  color: active ? '#2d6414' : '#664',
  background: active
    ? 'linear-gradient(180deg, #d4eac0 0%, #b8d8a0 100%)'
    : 'linear-gradient(180deg, #e8e8e0 0%, #d4d4c8 100%)',
  border: `1px solid ${active ? '#8cb870' : '#b0b0a8'}`,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 1px rgba(0,0,0,0.06)`,
  textShadow: `0 1px 0 rgba(255,255,255,0.4)`,
  userSelect: 'none',
}))

const Body = styled(Box)({
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  overflow: 'hidden',
})

const Sidebar = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 8px',
  gap: 1,
  background: `linear-gradient(180deg, ${c.sidebarBg} 0%, #d8d8d8 100%)`,
  borderRight: `1px solid ${c.border}`,
  boxShadow: `inset -1px 0 0 ${c.highlight}`,
})

const SidebarLabel = styled(Typography)({
  fontFamily: font,
  fontSize: 9,
  fontWeight: 700,
  color: c.textDim,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '4px 8px 3px',
  textShadow: `0 1px 0 rgba(255,255,255,0.5)`,
  userSelect: 'none',
})

const NavItem = styled(ButtonBase)<{ selected?: boolean }>(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 8px',
  borderRadius: 3,
  width: '100%',
  justifyContent: 'flex-start',
  fontFamily: font,
  fontSize: 11,
  fontWeight: selected ? 700 : 400,
  color: selected ? c.white : c.text,
  background: selected
    ? 'linear-gradient(180deg, #6c99d0 0%, #4776b8 100%)'
    : 'transparent',
  boxShadow: selected
    ? 'inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.15)'
    : 'none',
  border: selected ? '1px solid #3a5f94' : '1px solid transparent',
  textShadow: selected
    ? '0 -1px 0 rgba(0,0,0,0.25)'
    : `0 1px 0 rgba(255,255,255,0.5)`,
  transition: 'none',
  '&:hover': {
    background: selected
      ? 'linear-gradient(180deg, #6c99d0 0%, #4776b8 100%)'
      : 'rgba(0,0,0,0.04)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 14,
    color: selected ? c.white : c.textMuted,
  },
}))

const MainPanel = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 20,
  padding: 24,
  position: 'relative',
  overflow: 'hidden',
})

const InsetPanel = styled(Box)({
  padding: '16px 24px',
  borderRadius: 4,
  border: `1px solid ${c.borderDark}`,
  background: `linear-gradient(180deg, #d8d8d8 0%, ${c.panelInset} 3%, #eaeaea 100%)`,
  boxShadow: `inset 0 1px 3px ${c.insetShadow}, 0 1px 0 ${c.highlight}`,
  textAlign: 'center',
  width: '100%',
  maxWidth: 340,
})

const KnobContainer = styled(Box)({
  position: 'relative',
  width: 160,
  height: 160,
  borderRadius: '50%',
  background: `linear-gradient(160deg, #d0d0d0 0%, #b8b8b8 40%, #a0a0a0 100%)`,
  border: '1px solid #888',
  boxShadow: [
    '0 4px 12px rgba(0,0,0,0.18)',
    '0 1px 3px rgba(0,0,0,0.1)',
    'inset 0 1px 0 rgba(255,255,255,0.5)',
  ].join(','),
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  '&:active': {
    boxShadow: [
      '0 2px 6px rgba(0,0,0,0.18)',
      'inset 0 2px 6px rgba(0,0,0,0.12)',
    ].join(','),
  },
})

const KnobFace = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  background: active
    ? `radial-gradient(circle at 40% 35%, #f0f0f0 0%, #ddd 50%, #c8c8c8 100%)`
    : `radial-gradient(circle at 40% 35%, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)`,
  border: `1px solid ${active ? '#a0a0a0' : '#909090'}`,
  boxShadow: `inset 0 2px 4px rgba(0,0,0,0.08), inset 0 -1px 0 rgba(255,255,255,0.4)`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '12%',
    left: '20%',
    width: '35%',
    height: '20%',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.35)',
    filter: 'blur(6px)',
    pointerEvents: 'none',
  },
}))

const PowerIconStyled = styled(PowerSettingsNewRounded, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  fontSize: 42,
  color: active ? c.greenOn : '#999',
  filter: active ? `drop-shadow(0 0 4px ${c.greenGlow})` : 'none',
  transition: 'color 0.2s, filter 0.2s',
}))

const Led = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: active
    ? `radial-gradient(circle at 40% 35%, ${c.greenGlow}, ${c.greenOn})`
    : `radial-gradient(circle at 40% 35%, #bbb, #999)`,
  boxShadow: active
    ? `0 0 6px ${c.greenGlow}, inset 0 1px 1px rgba(255,255,255,0.4)`
    : `inset 0 1px 2px rgba(0,0,0,0.2)`,
  border: `1px solid ${active ? '#4a8830' : '#888'}`,
  transition: 'all 0.2s',
}))

const StatusRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '3px 0',
  '& + &': {
    borderTop: `1px solid #d0d0d0`,
  },
})

const StatusKey = styled(Typography)({
  fontFamily: font,
  fontSize: 10,
  fontWeight: 400,
  color: c.textMuted,
  userSelect: 'none',
})

const StatusVal = styled(Typography)({
  fontFamily: font,
  fontSize: 10,
  fontWeight: 700,
  color: c.text,
  userSelect: 'none',
})

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
      ? c.redOff
      : level > 3
        ? '#c8a030'
        : c.greenOn
    : '#ccc',
  border: `1px solid ${active ? (level > 5 ? '#a03020' : level > 3 ? '#a08020' : '#4a8830') : '#b8b8b8'}`,
  transition: 'all 0.2s',
}))

const FooterBar = styled(Box)({
  height: 22,
  minHeight: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 10px',
  background: `linear-gradient(180deg, #d4d4d4 0%, #c0c0c0 100%)`,
  borderTop: `1px solid ${c.border}`,
  boxShadow: `inset 0 1px 0 ${c.highlight}`,
  fontSize: 9,
  color: c.textDim,
  fontFamily: font,
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
      {/* ── Toolbar ── */}
      <Toolbar data-tauri-drag-region>
        <Led active={indicator} />
        <ToolbarTitle>Clash Verge Rev</ToolbarTitle>
        <ToolbarSpacer data-tauri-drag-region />
        <ToolbarBadge active={indicator}>
          {indicator ? 'PROXY ON' : 'PROXY OFF'}
        </ToolbarBadge>
        <Typography sx={{ fontFamily: font, fontSize: 10, color: c.textDim }}>
          {timeLabel}
        </Typography>
      </Toolbar>

      {/* ── Body ── */}
      <Body>
        {/* Left Sidebar */}
        <Sidebar>
          <SidebarLabel>Menu</SidebarLabel>
          {menuItems.map((item) => {
            const label = t(item.labelKey)
            return (
              <NavItem
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-label={label}
              >
                <item.icon />
                {label}
              </NavItem>
            )
          })}
        </Sidebar>

        {/* Center Panel */}
        <MainPanel data-tauri-drag-region>
          <Typography
            sx={{
              fontFamily: font,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: c.textDim,
              textShadow: `0 1px 0 rgba(255,255,255,0.5)`,
            }}
          >
            System Proxy Control
          </Typography>

          {/* Power Knob */}
          <KnobContainer onClick={handleToggleProxy}>
            <KnobFace active={indicator}>
              <PowerIconStyled active={indicator} />
            </KnobFace>
          </KnobContainer>

          {/* ON / OFF label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Led active={indicator} />
            <Typography
              sx={{
                fontFamily: font,
                fontSize: 12,
                fontWeight: 700,
                color: indicator ? '#2d6414' : c.textMuted,
                letterSpacing: '0.15em',
                textShadow: `0 1px 0 rgba(255,255,255,0.5)`,
              }}
            >
              {indicator ? 'ON' : 'OFF'}
            </Typography>
          </Box>

          {/* Status Panel */}
          <InsetPanel>
            <StatusRow>
              <StatusKey>Status</StatusKey>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Led active={indicator} />
                <StatusVal>{indicator ? 'Connected' : 'Disconnected'}</StatusVal>
              </Box>
            </StatusRow>
            <StatusRow>
              <StatusKey>Mode</StatusKey>
              <StatusVal>{indicator ? 'System Proxy' : 'Direct'}</StatusVal>
            </StatusRow>
            <StatusRow>
              <StatusKey>Date</StatusKey>
              <StatusVal>{dateLabel}</StatusVal>
            </StatusRow>
            <StatusRow>
              <StatusKey>Signal</StatusKey>
              <VUMeterBar>
                {Array.from({ length: 7 }, (_, i) => (
                  <VUSegment key={i} active={indicator} level={i} />
                ))}
              </VUMeterBar>
            </StatusRow>
          </InsetPanel>
        </MainPanel>
      </Body>

      {/* ── Footer / Status Bar ── */}
      <FooterBar>
        <span>{indicator ? 'System proxy active' : 'Direct connection'}</span>
        <span>Clash Verge Rev v2.4</span>
      </FooterBar>
    </Shell>
  )
}

export default DashboardPage
