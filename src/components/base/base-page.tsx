import DnsRounded from '@mui/icons-material/DnsRounded'
import ForkRightRounded from '@mui/icons-material/ForkRightRounded'
import HomeRounded from '@mui/icons-material/HomeRounded'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import SubjectRounded from '@mui/icons-material/SubjectRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import { Box, ButtonBase, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router'

import { retroColors as c, retroFonts, grainBg } from '@/styles/retro-theme'

import { BaseErrorBoundary } from './base-error-boundary'

interface Props {
  title?: React.ReactNode
  header?: React.ReactNode
  contentStyle?: React.CSSProperties
  children?: ReactNode
  full?: boolean
}

const navItems = [
  {
    icon: HomeRounded,
    labelKey: 'Dashboard',
    path: '/',
    isHome: true,
  },
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

const PageShell = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  fontFamily: retroFonts.ui,
  fontSize: 11,
  color: c.text,
  background: c.panelBg,
  backgroundImage: grainBg,
  overflow: 'hidden',
  WebkitFontSmoothing: 'antialiased',
})

const PageHeader = styled('header')({
  display: 'flex',
  alignItems: 'center',
  padding: '0 14px',
  height: 36,
  minHeight: 36,
  gap: 10,
  background: `linear-gradient(180deg, ${c.brownLight} 0%, ${c.brown} 100%)`,
  borderBottom: '1px solid #2a1e14',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.2)',
  userSelect: 'none',
  flexShrink: 0,
})

const HeaderTitle = styled(Typography)({
  fontFamily: retroFonts.mono,
  fontSize: 12,
  fontWeight: 700,
  color: c.cream,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
  whiteSpace: 'nowrap',
})

const HeaderActions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  '& .MuiButton-root, & .MuiLoadingButton-root': {
    borderRadius: 3,
    border: `1px solid rgba(255,255,255,0.15)`,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
    fontFamily: retroFonts.ui,
    fontSize: 10,
    fontWeight: 600,
    color: c.cream,
    textTransform: 'none',
    padding: '2px 10px',
    minWidth: 'auto',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
    '&:hover': {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
    },
    '&.MuiButton-contained': {
      border: '1px solid #3a6830',
      background: 'linear-gradient(180deg, #5a9a40 0%, #4a8a30 100%)',
      color: '#f5f0e6',
      '&:hover': {
        background: 'linear-gradient(180deg, #6aaa50 0%, #5a9a40 100%)',
      },
    },
    '&.MuiButton-outlined': {
      border: `1px solid rgba(255,255,255,0.2)`,
      background: 'transparent',
      color: 'rgba(245,240,230,0.7)',
      '&:hover': {
        background: 'rgba(255,255,255,0.06)',
        color: c.cream,
      },
    },
  },
  '& .MuiButtonGroup-root .MuiButton-root': {
    borderRadius: 0,
    '&:first-of-type': { borderRadius: '3px 0 0 3px' },
    '&:last-of-type': { borderRadius: '0 3px 3px 0' },
  },
  '& .MuiIconButton-root': {
    color: 'rgba(245,240,230,0.6)',
    padding: 4,
    '&:hover': {
      color: c.cream,
      background: 'rgba(255,255,255,0.08)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 18,
    },
  },
  '& .MuiTypography-root, & span': {
    fontFamily: retroFonts.mono,
    fontSize: 9,
    color: 'rgba(245,240,230,0.5)',
    letterSpacing: '0.06em',
  },
})

const FooterNav = styled('nav')({
  position: 'fixed',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  padding: '6px 10px',
  gap: 4,
  background: `linear-gradient(180deg, ${c.brown} 0%, #3a2a1c 100%)`,
  border: `1px solid ${c.brownLight}`,
  borderRadius: 12,
  boxShadow: [
    `0 8px 32px rgba(40, 25, 10, 0.5)`,
    `0 2px 8px rgba(40, 25, 10, 0.3)`,
    `inset 0 1px 0 rgba(255, 255, 250, 0.12)`,
  ].join(','),
  zIndex: 1000,
})

const NavButton = styled(ButtonBase, {
  shouldForwardProp: (p) => p !== 'selected',
})<{ selected?: boolean }>(({ selected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  padding: '8px 14px',
  borderRadius: 8,
  fontFamily: retroFonts.ui,
  fontSize: 10,
  fontWeight: selected ? 700 : 500,
  color: selected ? c.cream : 'rgba(200, 191, 176, 0.6)',
  background: selected
    ? `linear-gradient(180deg, ${c.brownLight} 0%, ${c.brownMid} 100%)`
    : 'transparent',
  border: selected
    ? `1px solid rgba(255, 255, 250, 0.15)`
    : '1px solid transparent',
  boxShadow: selected
    ? `inset 0 1px 0 rgba(255,255,250,0.1), 0 0 12px rgba(245, 240, 230, 0.08)`
    : 'none',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background 0.2s ease, color 0.2s ease',
  minWidth: 52,
  '&:hover': {
    background: selected
      ? `linear-gradient(180deg, ${c.brownLight} 0%, ${c.brownMid} 100%)`
      : 'rgba(255, 255, 250, 0.06)',
    color: c.cream,
  },
  '&:active': {
    background: 'rgba(255, 255, 250, 0.08)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
    color: selected ? c.cream : 'rgba(200, 191, 176, 0.5)',
    transition: 'color 0.2s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    color: c.cream,
  },
}))

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, full, children } = props
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <BaseErrorBoundary>
      <PageShell className="base-page">
        {(title || header) && (
          <PageHeader data-tauri-drag-region="true">
            <HeaderTitle data-tauri-drag-region="true">
              {title}
            </HeaderTitle>

            <Box sx={{ flex: 1 }} data-tauri-drag-region="true" />

            {header && <HeaderActions>{header}</HeaderActions>}
          </PageHeader>
        )}

        <div
          className={full ? 'base-container no-padding' : 'base-container'}
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            overflow: 'auto',
            paddingBottom: 72,
          }}
        >
          <section style={{ backgroundColor: 'transparent' }}>
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </div>

        <FooterNav>
          {navItems.map((item) => {
            const isSelected = location.pathname === item.path
            const label = item.isHome ? item.labelKey : t(item.labelKey)
            return (
              <NavButton
                key={item.path}
                selected={isSelected}
                onClick={() => navigate(item.path)}
                aria-label={label}
              >
                <item.icon />
                {label}
              </NavButton>
            )
          })}
        </FooterNav>
      </PageShell>
    </BaseErrorBoundary>
  )
}
