import DnsRounded from '@mui/icons-material/DnsRounded'
import ForkRightRounded from '@mui/icons-material/ForkRightRounded'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import SubjectRounded from '@mui/icons-material/SubjectRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { alpha, keyframes, styled } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { useSystemProxyState } from '@/hooks/use-system-proxy-state'

type DashboardMenuItem = {
  angle: number
  icon: typeof WifiRounded
  labelKey: string
  path: string
  accent: string
}

const dashboardMenuItems: DashboardMenuItem[] = [
  {
    angle: 0,
    icon: DnsRounded,
    labelKey: 'layout.components.navigation.tabs.profiles',
    path: '/profiles',
    accent: '#8bd6ff',
  },
  {
    angle: 60,
    icon: SettingsRounded,
    labelKey: 'layout.components.navigation.tabs.settings',
    path: '/settings',
    accent: '#cdb8ff',
  },
  {
    angle: 120,
    icon: WifiRounded,
    labelKey: 'layout.components.navigation.tabs.proxies',
    path: '/proxies',
    accent: '#7be3d1',
  },
  {
    angle: 180,
    icon: SubjectRounded,
    labelKey: 'layout.components.navigation.tabs.logs',
    path: '/logs',
    accent: '#ffe0a3',
  },
  {
    angle: 240,
    icon: LanguageRounded,
    labelKey: 'layout.components.navigation.tabs.connections',
    path: '/connections',
    accent: '#8fb8ff',
  },
  {
    angle: 300,
    icon: ForkRightRounded,
    labelKey: 'layout.components.navigation.tabs.rules',
    path: '/rules',
    accent: '#9fd6ff',
  },
]

const dashboardMotion = {
  fluid: '820ms cubic-bezier(0.22, 1, 0.36, 1)',
  soft: '280ms cubic-bezier(0.16, 1, 0.3, 1)',
  hover: '220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  orbit: '90s linear infinite',
}

const ambientShift = keyframes`
  0% {
    transform: scale(1) translate3d(-2%, 0, 0);
    opacity: 0.68;
  }
  50% {
    transform: scale(1.06) translate3d(2%, -2%, 0);
    opacity: 1;
  }
  100% {
    transform: scale(1.02) translate3d(-1%, 1%, 0);
    opacity: 0.8;
  }
`

const orbitSweep = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const orbitCounterSweep = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
`

const corePulse = keyframes`
  0%, 100% {
    transform: scale(1);
    filter: saturate(1);
  }
  50% {
    transform: scale(1.028);
    filter: saturate(1.06);
  }
`

const nodeFloat = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-3px);
  }
`

const signalBlink = keyframes`
  0%, 100% {
    opacity: 0.45;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
`

const coreShimmer = keyframes`
  0% {
    transform: translate3d(-26%, -24%, 0) rotate(0deg);
    opacity: 0;
  }
  18% {
    opacity: 0.72;
  }
  52% {
    opacity: 0.2;
  }
  100% {
    transform: translate3d(28%, 26%, 0) rotate(18deg);
    opacity: 0;
  }
`

const dockReveal = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 8px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

const DashboardShell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  '--dashboard-stage-size':
    'min(calc(100vw - 72px), calc(100vh - 72px), 760px)',
  '--dashboard-orbit-radius': 'clamp(156px, 21vw, 252px)',
  '--dashboard-core-size': 'clamp(196px, 27vw, 286px)',
  '--dashboard-node-size': 'clamp(74px, 8vw, 92px)',
  '--dashboard-label-gap': '14px',
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  overflow: 'hidden',
  padding: '24px',
  isolation: 'isolate',
  background: active
    ? [
        'radial-gradient(circle at 50% 45%, rgba(125, 214, 255, 0.18) 0%, rgba(125, 214, 255, 0) 32%)',
        'radial-gradient(circle at 18% 22%, rgba(104, 196, 255, 0.2) 0%, rgba(104, 196, 255, 0) 32%)',
        'radial-gradient(circle at 82% 18%, rgba(164, 174, 255, 0.14) 0%, rgba(164, 174, 255, 0) 30%)',
        'linear-gradient(145deg, #06111f 0%, #0a1d31 42%, #112c42 100%)',
      ].join(',')
    : [
        'radial-gradient(circle at 50% 45%, rgba(145, 164, 188, 0.09) 0%, rgba(145, 164, 188, 0) 32%)',
        'radial-gradient(circle at 18% 22%, rgba(112, 134, 168, 0.1) 0%, rgba(112, 134, 168, 0) 34%)',
        'radial-gradient(circle at 80% 18%, rgba(85, 108, 140, 0.12) 0%, rgba(85, 108, 140, 0) 28%)',
        'linear-gradient(145deg, #05080f 0%, #0b121c 48%, #111b28 100%)',
      ].join(','),
  transition: `background ${dashboardMotion.fluid}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-12%',
    background: active
      ? [
          'radial-gradient(circle at 50% 50%, rgba(103, 221, 255, 0.14) 0%, rgba(103, 221, 255, 0) 35%)',
          'radial-gradient(circle at 38% 64%, rgba(120, 154, 255, 0.11) 0%, rgba(120, 154, 255, 0) 24%)',
        ].join(',')
      : [
          'radial-gradient(circle at 50% 50%, rgba(173, 188, 212, 0.08) 0%, rgba(173, 188, 212, 0) 34%)',
          'radial-gradient(circle at 62% 36%, rgba(122, 142, 168, 0.08) 0%, rgba(122, 142, 168, 0) 26%)',
        ].join(','),
    filter: 'blur(42px)',
    opacity: active ? 1 : 0.78,
    animation: `${ambientShift} 18s ease-in-out infinite alternate`,
    transition: `opacity ${dashboardMotion.fluid}, background ${dashboardMotion.fluid}`,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: [
      'radial-gradient(circle at 20% 28%, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px)',
      'radial-gradient(circle at 78% 24%, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px)',
      'radial-gradient(circle at 72% 72%, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px)',
      'radial-gradient(circle at 26% 76%, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px)',
    ].join(','),
    backgroundSize: '260px 260px, 320px 320px, 360px 360px, 420px 420px',
    opacity: active ? 0.32 : 0.18,
    pointerEvents: 'none',
    transition: `opacity ${dashboardMotion.fluid}`,
  },
  '@media (max-width: 900px)': {
    '--dashboard-stage-size':
      'min(calc(100vw - 40px), calc(100vh - 40px), 680px)',
    '--dashboard-orbit-radius': 'clamp(152px, 24vw, 228px)',
    '--dashboard-core-size': 'clamp(188px, 30vw, 260px)',
    '--dashboard-node-size': 'clamp(70px, 10vw, 86px)',
  },
  '@media (max-width: 640px)': {
    padding: '16px',
    '--dashboard-stage-size':
      'min(calc(100vw - 20px), calc(100vh - 20px), 560px)',
    '--dashboard-orbit-radius': 'clamp(132px, 27vw, 196px)',
    '--dashboard-core-size': 'clamp(164px, 34vw, 224px)',
    '--dashboard-node-size': 'clamp(60px, 11vw, 74px)',
  },
}))

const DashboardStage = styled(Box)({
  position: 'relative',
  width: 'var(--dashboard-stage-size)',
  height: 'var(--dashboard-stage-size)',
  maxWidth: '100%',
  maxHeight: '100%',
  display: 'grid',
  placeItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '18%',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(105, 194, 240, 0.12) 0%, rgba(105, 194, 240, 0.03) 38%, rgba(105, 194, 240, 0) 72%)',
    filter: 'blur(26px)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: '10%',
    width: '58%',
    height: '11%',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(3, 8, 14, 0.44) 0%, transparent 70%)',
    filter: 'blur(18px)',
    pointerEvents: 'none',
  },
})

const CornerHud = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'anchor',
})<{
  anchor: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}>(({ anchor }) => {
  const basePosition =
    anchor === 'top-left'
      ? {
          top: 28,
          left: 28,
          alignItems: 'flex-start',
          textAlign: 'left' as const,
        }
      : anchor === 'top-right'
        ? {
            top: 28,
            right: 28,
            alignItems: 'flex-end',
            textAlign: 'right' as const,
          }
        : anchor === 'bottom-left'
          ? {
              bottom: 28,
              left: 28,
              alignItems: 'flex-start',
              textAlign: 'left' as const,
            }
          : {
              bottom: 28,
              right: 28,
              alignItems: 'flex-end',
              textAlign: 'right' as const,
            }

  return {
    position: 'fixed',
    zIndex: 14,
    display: 'grid',
    gap: 4,
    pointerEvents: 'none',
    ...basePosition,
    '@media (max-width: 900px)': {
      top: anchor.includes('top') ? 20 : undefined,
      bottom: anchor.includes('bottom') ? 20 : undefined,
      left: anchor.includes('left') ? 20 : undefined,
      right: anchor.includes('right') ? 20 : undefined,
    },
    '@media (max-width: 640px)': {
      gap: 2,
      top: anchor.includes('top') ? 14 : undefined,
      bottom: anchor.includes('bottom') ? 14 : undefined,
      left: anchor.includes('left') ? 14 : undefined,
      right: anchor.includes('right') ? 14 : undefined,
    },
  }
})

const CornerLabel = styled(Typography)({
  color: 'rgba(192, 205, 225, 0.42)',
  fontSize: '0.64rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  lineHeight: 1.2,
})

const CornerValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'strong',
})<{ strong?: boolean }>(({ strong }) => ({
  color: strong ? 'rgba(241, 247, 255, 0.96)' : 'rgba(225, 235, 248, 0.82)',
  fontSize: strong ? 'clamp(1.7rem, 2.4vw, 2.3rem)' : '0.96rem',
  fontWeight: strong ? 500 : 600,
  letterSpacing: strong ? '0.08em' : '0.1em',
  textTransform: strong ? 'none' : 'uppercase',
  lineHeight: 1,
}))

const CornerHint = styled(Typography)({
  color: 'rgba(176, 192, 215, 0.62)',
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  lineHeight: 1.35,
})

const CornerStatus = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
})

const CornerStatusDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: active ? '#7ef2d4' : 'rgba(214, 223, 239, 0.46)',
  boxShadow: active
    ? '0 0 12px rgba(126, 242, 212, 0.58)'
    : '0 0 8px rgba(214, 223, 239, 0.16)',
}))

const HoverDock = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'visible' && prop !== 'accent' && prop !== 'active',
})<{ visible: boolean; accent: string; active: boolean }>(
  ({ visible, accent, active }) => ({
    position: 'absolute',
    top: 'clamp(18px, 5vw, 36px)',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 6,
    minWidth: 160,
    padding: '10px 14px 11px',
    borderRadius: 999,
    border: `1px solid ${visible ? alpha(accent, 0.28) : active ? 'rgba(171, 227, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)'}`,
    background: visible ? 'rgba(8, 16, 28, 0.62)' : 'rgba(8, 12, 20, 0.3)',
    backdropFilter: 'blur(24px) saturate(160%)',
    boxShadow: visible
      ? `0 18px 60px ${alpha('#01060d', 0.34)}, 0 0 24px ${alpha(accent, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.14)`
      : 'none',
    opacity: visible ? 1 : 0,
    pointerEvents: 'none',
    transition: `opacity ${dashboardMotion.soft}, background ${dashboardMotion.fluid}, border-color ${dashboardMotion.fluid}, box-shadow ${dashboardMotion.fluid}`,
    animation: visible ? `${dockReveal} ${dashboardMotion.soft}` : 'none',
  }),
)

const InfoTitle = styled(Typography)({
  color: 'rgba(244, 248, 255, 0.96)',
  fontSize: '0.8rem',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  textAlign: 'center',
  lineHeight: 1.1,
})

const InfoCaption = styled(Typography)({
  marginTop: 4,
  color: 'rgba(195, 206, 226, 0.72)',
  fontSize: '0.68rem',
  letterSpacing: '0.08em',
  textAlign: 'center',
  lineHeight: 1.2,
})

const OrbitField = styled(Box)({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 'calc(var(--dashboard-orbit-radius) * 2 + var(--dashboard-node-size))',
  height:
    'calc(var(--dashboard-orbit-radius) * 2 + var(--dashboard-node-size))',
  transform: 'translate(-50%, -50%)',
})

const OrbitSpinner = styled(Box)({
  position: 'absolute',
  inset: 0,
  transformOrigin: '50% 50%',
  animation: `${orbitSweep} ${dashboardMotion.orbit}`,
})

const OrbitLayer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 'calc(var(--dashboard-node-size) / 2)',
    borderRadius: '50%',
    border: active
      ? '1px solid rgba(142, 215, 255, 0.16)'
      : '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: active
      ? '0 0 0 1px rgba(108, 182, 224, 0.06), inset 0 0 24px rgba(91, 177, 225, 0.06)'
      : '0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 0 18px rgba(255, 255, 255, 0.03)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 'calc(var(--dashboard-node-size) / 2 - 12px)',
    borderRadius: '50%',
    background: active
      ? 'conic-gradient(from 45deg, transparent 0deg, rgba(131, 222, 255, 0.18) 56deg, transparent 116deg, transparent 220deg, rgba(119, 146, 255, 0.12) 278deg, transparent 334deg)'
      : 'conic-gradient(from 45deg, transparent 0deg, rgba(196, 205, 221, 0.08) 54deg, transparent 116deg, transparent 224deg, rgba(142, 154, 174, 0.06) 286deg, transparent 338deg)',
    filter: 'blur(12px)',
    opacity: active ? 1 : 0.72,
  },
}))

const OrbitTracer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'accent',
})<{ active: boolean; accent: string }>(({ active, accent }) => ({
  position: 'absolute',
  left: '50%',
  top: 'calc(var(--dashboard-node-size) / 2 - 2px)',
  width: 8,
  height: 8,
  marginLeft: -4,
  borderRadius: '50%',
  background: active ? accent : 'rgba(188, 202, 222, 0.5)',
  boxShadow: active
    ? `0 0 16px ${alpha(accent, 0.66)}`
    : '0 0 10px rgba(188, 202, 222, 0.18)',
  opacity: active ? 0.94 : 0.42,
}))

const OrbitNodeAnchor = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'angle',
})<{ angle: number }>(({ angle }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 0,
  height: 0,
  zIndex: 4,
  transform: `rotate(${angle}deg) translateY(calc(-1 * var(--dashboard-orbit-radius)))`,
  transformOrigin: '0 0',
}))

const OrbitNodeCounterSpin = styled(Box)({
  transform: 'translate(-50%, -50%)',
  animation: `${orbitCounterSweep} ${dashboardMotion.orbit}`,
})

const OrbitNodeGroup = styled(Box)({
  position: 'relative',
  animation: `${nodeFloat} 9s ease-in-out infinite`,
  pointerEvents: 'auto',
})

const OrbitNodeButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== 'accent' && prop !== 'highlighted' && prop !== 'energized',
})<{ accent: string; highlighted: boolean; energized: boolean }>(
  ({ accent, highlighted, energized }) => ({
    width: 'var(--dashboard-node-size)',
    height: 'var(--dashboard-node-size)',
    borderRadius: '50%',
    color: 'rgba(244, 248, 255, 0.94)',
    background: `linear-gradient(180deg, ${alpha('#ffffff', highlighted ? 0.13 : 0.09)} 0%, ${alpha(
      '#0b1827',
      highlighted ? 0.58 : 0.68,
    )} 100%)`,
    border: `1px solid ${highlighted ? alpha(accent, 0.34) : alpha('#ffffff', energized ? 0.14 : 0.1)}`,
    backdropFilter: 'blur(20px) saturate(160%)',
    boxShadow: [
      `0 14px 44px ${alpha('#02060c', 0.34)}`,
      `0 0 0 1px ${alpha('#ffffff', 0.05)}`,
      `inset 0 1px 0 ${alpha('#ffffff', 0.18)}`,
      `inset 0 -16px 28px ${alpha(highlighted ? accent : '#9ac5ff', highlighted ? 0.14 : energized ? 0.08 : 0.05)}`,
    ].join(','),
    transition: [
      `transform ${dashboardMotion.hover}`,
      `box-shadow ${dashboardMotion.hover}`,
      `border-color ${dashboardMotion.hover}`,
      `background ${dashboardMotion.fluid}`,
    ].join(','),
    '&:hover': {
      transform: 'translateY(-4px) scale(1.06)',
      boxShadow: [
        `0 18px 52px ${alpha('#02060c', 0.4)}`,
        `0 0 24px ${alpha(accent, 0.22)}`,
        `0 0 0 1px ${alpha('#ffffff', 0.08)}`,
        `inset 0 1px 0 ${alpha('#ffffff', 0.22)}`,
        `inset 0 -20px 32px ${alpha(accent, 0.16)}`,
      ].join(','),
      borderColor: alpha(accent, 0.34),
    },
    '&:active': {
      transform: 'translateY(-1px) scale(0.98)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 'clamp(1.45rem, 2vw, 1.8rem)',
      filter: `drop-shadow(0 0 12px ${alpha(accent, highlighted ? 0.18 : 0.08)})`,
    },
  }),
)

const OrbitNodeLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  left: '50%',
  top: 'calc(100% + var(--dashboard-label-gap))',
  whiteSpace: 'nowrap',
  fontSize: '0.62rem',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: active ? 'rgba(232, 241, 255, 0.84)' : 'rgba(197, 206, 221, 0.62)',
  textShadow: '0 6px 20px rgba(0, 0, 0, 0.28)',
  opacity: active ? 1 : 0,
  transformOrigin: '50% 0',
  transition: `color ${dashboardMotion.hover}, opacity ${dashboardMotion.hover}, transform ${dashboardMotion.hover}`,
  ...(active
    ? { transform: 'translate(-50%, 0)' }
    : { transform: 'translate(-50%, -4px)' }),
  '@media (max-width: 640px)': {
    display: 'none',
  },
}))

const CoreButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'relative',
  width: 'var(--dashboard-core-size)',
  height: 'var(--dashboard-core-size)',
  borderRadius: '50%',
  padding: 0,
  overflow: 'visible',
  zIndex: 5,
  isolation: 'isolate',
  transition: [
    `transform ${dashboardMotion.soft}`,
    `filter ${dashboardMotion.fluid}`,
  ].join(','),
  animation: active ? `${corePulse} 4.8s ease-in-out infinite` : 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-16%',
    borderRadius: '50%',
    background: active
      ? 'radial-gradient(circle, rgba(111, 215, 255, 0.3) 0%, rgba(111, 215, 255, 0.12) 28%, rgba(111, 215, 255, 0) 68%)'
      : 'radial-gradient(circle, rgba(178, 189, 204, 0.18) 0%, rgba(178, 189, 204, 0.08) 24%, rgba(178, 189, 204, 0) 68%)',
    filter: 'blur(18px)',
    opacity: active ? 1 : 0.6,
    transition: `background ${dashboardMotion.fluid}, opacity ${dashboardMotion.fluid}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '-4%',
    borderRadius: '50%',
    border: active
      ? '1px solid rgba(148, 219, 255, 0.22)'
      : '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: active
      ? '0 0 0 1px rgba(125, 214, 255, 0.08)'
      : '0 0 0 1px rgba(255, 255, 255, 0.03)',
    transition: `border-color ${dashboardMotion.fluid}, box-shadow ${dashboardMotion.fluid}`,
  },
  '&:hover': {
    transform: active ? 'scale(1.03)' : 'scale(1.02)',
  },
  '&:active': {
    transform: 'scale(0.985)',
  },
}))

const CoreAura = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  inset: '-26%',
  borderRadius: '50%',
  background: active
    ? 'conic-gradient(from 180deg, transparent 0deg, rgba(124, 218, 255, 0.14) 48deg, transparent 102deg, transparent 216deg, rgba(139, 163, 255, 0.12) 284deg, transparent 336deg)'
    : 'conic-gradient(from 180deg, transparent 0deg, rgba(180, 194, 214, 0.08) 48deg, transparent 104deg, transparent 218deg, rgba(180, 194, 214, 0.06) 286deg, transparent 338deg)',
  filter: 'blur(16px)',
  opacity: active ? 1 : 0.6,
  animation: `${orbitSweep} 18s linear infinite`,
  transition: `background ${dashboardMotion.fluid}, opacity ${dashboardMotion.fluid}`,
}))

const CoreSurface = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  inset: '8%',
  borderRadius: '50%',
  overflow: 'hidden',
  background: active
    ? [
        'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.04) 20%, transparent 36%)',
        'radial-gradient(circle at 50% 65%, rgba(124, 218, 255, 0.28) 0%, rgba(124, 218, 255, 0) 50%)',
        'linear-gradient(180deg, rgba(22, 48, 72, 0.94) 0%, rgba(7, 16, 28, 0.96) 100%)',
      ].join(',')
    : [
        'radial-gradient(circle at 30% 26%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 18%, transparent 34%)',
        'radial-gradient(circle at 50% 65%, rgba(139, 155, 176, 0.16) 0%, rgba(139, 155, 176, 0) 48%)',
        'linear-gradient(180deg, rgba(22, 27, 37, 0.96) 0%, rgba(7, 11, 18, 0.98) 100%)',
      ].join(','),
  border: active
    ? '1px solid rgba(156, 224, 255, 0.22)'
    : '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: active
    ? [
        '0 30px 110px rgba(12, 40, 74, 0.46)',
        'inset 0 1px 0 rgba(255, 255, 255, 0.18)',
        'inset 0 -42px 56px rgba(0, 0, 0, 0.28)',
      ].join(',')
    : [
        '0 22px 80px rgba(0, 0, 0, 0.42)',
        'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'inset 0 -36px 48px rgba(0, 0, 0, 0.34)',
      ].join(','),
  backdropFilter: 'blur(18px) saturate(150%)',
  transition: [
    `background ${dashboardMotion.fluid}`,
    `border-color ${dashboardMotion.fluid}`,
    `box-shadow ${dashboardMotion.fluid}`,
  ].join(','),
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-8%',
    background:
      'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.18) 46%, transparent 58%)',
    opacity: active ? 0.54 : 0.28,
    transform: 'translate3d(-26%, -24%, 0)',
    animation: `${coreShimmer} 8.2s ease-in-out infinite`,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '18%',
    borderRadius: '50%',
    border: active
      ? '1px solid rgba(167, 226, 255, 0.12)'
      : '1px solid rgba(255, 255, 255, 0.04)',
    boxShadow: active ? 'inset 0 0 26px rgba(96, 210, 255, 0.05)' : 'none',
    pointerEvents: 'none',
  },
}))

const CoreInnerRing = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  inset: '14%',
  borderRadius: '50%',
  border: active
    ? '1px solid rgba(170, 228, 255, 0.18)'
    : '1px solid rgba(255, 255, 255, 0.06)',
  boxShadow: active
    ? '0 0 40px rgba(96, 210, 255, 0.12), inset 0 0 32px rgba(96, 210, 255, 0.08)'
    : 'inset 0 0 24px rgba(255, 255, 255, 0.03)',
  transition: `border-color ${dashboardMotion.fluid}, box-shadow ${dashboardMotion.fluid}`,
}))

const CoreContent = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  textAlign: 'center',
})

const CoreIcon = styled(PowerSettingsNewRounded, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  fontSize: 'clamp(4rem, 9vw, 5.5rem)',
  color: active ? '#eff9ff' : 'rgba(244, 247, 253, 0.92)',
  filter: active
    ? 'drop-shadow(0 0 16px rgba(117, 223, 255, 0.36))'
    : 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.14))',
  transition: `color ${dashboardMotion.fluid}, filter ${dashboardMotion.fluid}`,
}))

const CoreMeta = styled(Box)({
  position: 'absolute',
  bottom: '14%',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'grid',
  gap: 4,
  pointerEvents: 'none',
})

const CoreStateLabel = styled(Typography)({
  color: 'rgba(234, 242, 251, 0.92)',
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
})

const CoreStateHint = styled(Typography)({
  color: 'rgba(188, 202, 222, 0.68)',
  fontSize: '0.66rem',
  letterSpacing: '0.08em',
  whiteSpace: 'nowrap',
})

const CoreSignal = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  top: '16%',
  right: '18%',
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: active ? '#7ef2d4' : 'rgba(255, 255, 255, 0.32)',
  boxShadow: active
    ? '0 0 16px rgba(126, 242, 212, 0.78)'
    : '0 0 10px rgba(255, 255, 255, 0.18)',
  animation: active ? `${signalBlink} 2.8s ease-in-out infinite` : 'none',
  transition: `background ${dashboardMotion.fluid}, box-shadow ${dashboardMotion.fluid}`,
}))

const DashboardPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { indicator, toggleSystemProxy } = useSystemProxyState()
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  const hoveredItem =
    dashboardMenuItems.find((item) => item.path === hoveredPath) ?? null

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 30_000)

    return () => window.clearInterval(timer)
  }, [])

  const handleToggleProxy = useCallback(() => {
    toggleSystemProxy(!indicator)
  }, [indicator, toggleSystemProxy])

  const handleMenuClick = useCallback(
    (path: string) => {
      navigate(path)
    },
    [navigate],
  )

  const timeLabel = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)

  const dayLabel = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
  }).format(now)

  return (
    <DashboardShell active={indicator}>
      <CornerHud anchor="top-left">
        <CornerLabel>Control Center</CornerLabel>
        <CornerStatus>
          <CornerHint>{indicator ? 'online' : 'offline'}</CornerHint>
          <CornerStatusDot active={indicator} />
        </CornerStatus>
      </CornerHud>

      <CornerHud anchor="top-right">
        <CornerValue strong>{timeLabel}</CornerValue>
        <CornerLabel>{dayLabel}</CornerLabel>
      </CornerHud>

      <CornerHud anchor="bottom-left">
        <CornerLabel>System</CornerLabel>
        <CornerValue>{indicator ? 'Active' : 'Standby'}</CornerValue>
        <CornerHint>
          {indicator ? 'Current route: Proxy' : 'Current route: Direct'}
        </CornerHint>
      </CornerHud>

      <CornerHud anchor="bottom-right">
        <CornerLabel>Hint</CornerLabel>
        <CornerValue>Soft Orbit</CornerValue>
        <CornerHint>Press & hold for advanced</CornerHint>
      </CornerHud>

      <DashboardStage>
        <HoverDock
          active={indicator}
          accent={hoveredItem?.accent ?? '#9ac5ff'}
          visible={Boolean(hoveredItem)}
        >
          <InfoTitle>{hoveredItem ? t(hoveredItem.labelKey) : ''}</InfoTitle>
          <InfoCaption>{hoveredItem ? 'Open section' : ''}</InfoCaption>
        </HoverDock>

        <OrbitField>
          <OrbitSpinner>
            <OrbitLayer active={indicator} />
            <OrbitTracer active={indicator} accent="#87d9ff" />

            {dashboardMenuItems.map((item, index) => {
              const label = t(item.labelKey)
              const isHighlighted = hoveredPath === item.path

              return (
                <OrbitNodeAnchor key={item.path} angle={item.angle}>
                  <OrbitNodeCounterSpin>
                    <OrbitNodeGroup
                      sx={{
                        animationDelay: `${index * 0.45}s`,
                      }}
                    >
                      <Tooltip
                        title={label}
                        placement="top"
                        arrow
                        slotProps={{
                          tooltip: {
                            sx: {
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'rgba(9, 15, 24, 0.9)',
                              backdropFilter: 'blur(18px)',
                              color: 'rgba(244,248,255,0.94)',
                              fontSize: '0.72rem',
                              letterSpacing: '0.08em',
                            },
                          },
                          arrow: {
                            sx: {
                              color: 'rgba(9, 15, 24, 0.9)',
                            },
                          },
                        }}
                      >
                        <OrbitNodeButton
                          highlighted={isHighlighted}
                          energized={indicator}
                          accent={item.accent}
                          disableRipple
                          onClick={() => handleMenuClick(item.path)}
                          onMouseEnter={() => setHoveredPath(item.path)}
                          onMouseLeave={() => setHoveredPath(null)}
                          onFocus={() => setHoveredPath(item.path)}
                          onBlur={() =>
                            setHoveredPath((current) =>
                              current === item.path ? null : current,
                            )
                          }
                          aria-label={label}
                        >
                          <item.icon />
                        </OrbitNodeButton>
                      </Tooltip>

                      <OrbitNodeLabel active={isHighlighted}>
                        {label}
                      </OrbitNodeLabel>
                    </OrbitNodeGroup>
                  </OrbitNodeCounterSpin>
                </OrbitNodeAnchor>
              )
            })}
          </OrbitSpinner>
        </OrbitField>

        <CoreButton
          active={indicator}
          disableRipple
          onClick={handleToggleProxy}
          aria-label="Toggle system proxy"
          aria-pressed={indicator}
        >
          <CoreAura active={indicator} />
          <CoreSurface active={indicator} />
          <CoreInnerRing active={indicator} />
          <CoreSignal active={indicator} />

          <CoreContent>
            <CoreIcon active={indicator} />
            <CoreMeta>
              <CoreStateLabel>
                {indicator ? 'Online' : 'Offline'}
              </CoreStateLabel>
              <CoreStateHint>
                {indicator ? 'Proxy engaged' : 'Direct connection'}
              </CoreStateHint>
            </CoreMeta>
          </CoreContent>
        </CoreButton>
      </DashboardStage>
    </DashboardShell>
  )
}

export default DashboardPage
