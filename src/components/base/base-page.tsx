import DnsRounded from '@mui/icons-material/DnsRounded'
import ForkRightRounded from '@mui/icons-material/ForkRightRounded'
import HomeRounded from '@mui/icons-material/HomeRounded'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import SubjectRounded from '@mui/icons-material/SubjectRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import { ButtonBase, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router'

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

const c = {
  cream: '#f5f0e6',
  creamDark: '#e8e0d0',
  brown: '#4a3728',
  brownLight: '#6b5744',
  text: '#3a2e24',
  textDim: '#8a7e72',
  borderMid: '#a89e90',
  borderDark: '#8a7e72',
  highlight: 'rgba(255, 255, 250, 0.45)',
  insetShadow: 'rgba(60, 40, 20, 0.15)',
}

const font =
  "'Courier New', 'Consolas', 'Monaco', 'Lucida Console', monospace"
const fontUI =
  "'Lucida Grande', 'Segoe UI', 'Helvetica Neue', Geneva, Verdana, sans-serif"

const grainBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`

const FloatingNav = styled('nav')({
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  padding: '6px 10px',
  gap: 4,
  background: `linear-gradient(180deg, #5c4433 0%, #3a2618 100%)`,
  borderRadius: 10,
  border: '1px solid #1a0e06',
  boxShadow: [
    '0 8px 32px rgba(20, 10, 4, 0.5)',
    '0 2px 8px rgba(20, 10, 4, 0.3)',
    `inset 0 1px 0 rgba(255,255,255,0.1)`,
    `inset 0 -1px 0 rgba(0,0,0,0.2)`,
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
  borderRadius: 7,
  fontFamily: fontUI,
  fontSize: 10,
  fontWeight: selected ? 700 : 500,
  color: selected ? '#fff' : 'rgba(245,240,230,0.6)',
  background: selected
    ? 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)'
    : 'transparent',
  border: selected
    ? '1px solid rgba(255,255,255,0.15)'
    : '1px solid transparent',
  boxShadow: selected
    ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 3px rgba(0,0,0,0.2)'
    : 'none',
  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background 0.15s ease, color 0.15s ease',
  minWidth: 52,
  '&:hover': {
    background: selected
      ? 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 100%)'
      : 'rgba(255,255,255,0.08)',
    color: '#fff',
  },
  '&:active': {
    background: 'rgba(0,0,0,0.12)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.25)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
    color: selected ? '#fff' : 'rgba(245,240,230,0.5)',
    transition: 'color 0.15s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    color: '#fff',
  },
}))

const NavSep = styled('div')({
  width: 1,
  height: 28,
  background: 'rgba(255,255,255,0.1)',
  margin: '0 2px',
  flexShrink: 0,
})

const PageShell = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  fontFamily: fontUI,
  overflow: 'hidden',
})

const PageHeader = styled('header')({
  display: 'flex',
  alignItems: 'center',
  padding: '10px 16px 8px',
  gap: 12,
  background: `linear-gradient(180deg, ${c.creamDark} 0%, #ddd5c5 100%)`,
  backgroundImage: grainBg,
  borderBottom: `1px solid ${c.borderMid}`,
  boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.03), 0 1px 2px ${c.insetShadow}`,
  userSelect: 'none',
  flexShrink: 0,
})

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, full, children } = props
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <BaseErrorBoundary>
      <PageShell className="base-page">
        {/* Page Header */}
        {(title || header) && (
          <PageHeader data-tauri-drag-region="true">
            <Typography
              sx={{
                fontFamily: font,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: c.text,
                textShadow: `0 1px 0 rgba(255,255,255,0.5)`,
              }}
              data-tauri-drag-region="true"
            >
              {title}
            </Typography>

            {header}
          </PageHeader>
        )}

        {/* Content */}
        <div
          className={full ? 'base-container no-padding' : 'base-container'}
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            overflow: 'auto',
            paddingBottom: 80,
          }}
        >
          <section style={{ backgroundColor: 'transparent' }}>
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </div>

        {/* Floating Bottom Navigation */}
        <FloatingNav>
          {navItems.map((item, index) => {
            const isSelected = location.pathname === item.path
            const label = item.isHome ? item.labelKey : t(item.labelKey)
            return (
              <React.Fragment key={item.path}>
                {index === 1 && <NavSep />}
                <NavButton
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
                  aria-label={label}
                >
                  <item.icon />
                  {label}
                </NavButton>
              </React.Fragment>
            )
          })}
        </FloatingNav>
      </PageShell>
    </BaseErrorBoundary>
  )
}
