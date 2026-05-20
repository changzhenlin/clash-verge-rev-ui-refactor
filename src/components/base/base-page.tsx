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
    icon: WifiRounded,
    labelKey: 'layout.components.navigation.tabs.proxies',
    path: '/proxies',
  },
  {
    icon: DnsRounded,
    labelKey: 'layout.components.navigation.tabs.profiles',
    path: '/profiles',
  },
  {
    icon: ForkRightRounded,
    labelKey: 'layout.components.navigation.tabs.rules',
    path: '/rules',
  },
  {
    icon: LanguageRounded,
    labelKey: 'layout.components.navigation.tabs.connections',
    path: '/connections',
  },
  {
    icon: SubjectRounded,
    labelKey: 'layout.components.navigation.tabs.logs',
    path: '/logs',
  },
  {
    icon: SettingsRounded,
    labelKey: 'layout.components.navigation.tabs.settings',
    path: '/settings',
  },
]

const PageShell = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fontSize: 14,
  color: '#0f172a',
  background: '#f8fafc',
  overflow: 'hidden',
  WebkitFontSmoothing: 'antialiased',
})

const Sidebar = styled('nav')({
  display: 'flex',
  flexDirection: 'column',
  width: 200,
  minWidth: 200,
  height: '100%',
  padding: '16px 8px',
  borderRight: '1px solid #e2e8f0',
  background: '#ffffff',
  boxSizing: 'border-box',
  gap: 2,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingTop: 48,
})

const NavButton = styled(ButtonBase, {
  shouldForwardProp: (p) => p !== 'selected',
})<{ selected?: boolean }>(({ selected }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  padding: '8px 12px',
  borderRadius: 8,
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fontSize: 13,
  fontWeight: selected ? 600 : 400,
  color: selected ? '#4f46e5' : '#64748b',
  background: selected ? '#eef2ff' : 'transparent',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.15s ease',
  width: '100%',
  justifyContent: 'flex-start',
  textAlign: 'left',
  '&:hover': {
    background: selected ? '#eef2ff' : '#f1f5f9',
    color: selected ? '#4f46e5' : '#334155',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
    color: selected ? '#6366f1' : '#94a3b8',
    transition: 'color 0.15s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    color: selected ? '#6366f1' : '#64748b',
  },
}))

const ContentArea = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  height: '100%',
  overflow: 'hidden',
})

const PageHeader = styled('header')({
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  height: 56,
  minHeight: 56,
  gap: 12,
  borderBottom: '1px solid #e2e8f0',
  background: '#ffffff',
  userSelect: 'none',
  flexShrink: 0,
})

const HeaderTitle = styled(Typography)({
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fontSize: 16,
  fontWeight: 600,
  color: '#0f172a',
  letterSpacing: '-0.01em',
  whiteSpace: 'nowrap',
})

const HeaderActions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  '& .MuiButton-root, & .MuiLoadingButton-root': {
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: '#334155',
    textTransform: 'none',
    padding: '6px 12px',
    minWidth: 'auto',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    '&:hover': {
      background: '#f8fafc',
      borderColor: '#cbd5e1',
    },
    '&.MuiButton-contained': {
      border: 'none',
      background: '#6366f1',
      color: '#ffffff',
      boxShadow: '0 1px 3px rgba(99, 102, 241, 0.3)',
      '&:hover': {
        background: '#4f46e5',
      },
    },
    '&.MuiButton-outlined': {
      border: '1px solid #e2e8f0',
      background: 'transparent',
      color: '#64748b',
      '&:hover': {
        background: '#f8fafc',
        color: '#334155',
      },
    },
  },
  '& .MuiButtonGroup-root .MuiButton-root': {
    borderRadius: 0,
    '&:first-of-type': { borderRadius: '8px 0 0 8px' },
    '&:last-of-type': { borderRadius: '0 8px 8px 0' },
  },
  '& .MuiIconButton-root': {
    color: '#64748b',
    padding: 6,
    borderRadius: 8,
    '&:hover': {
      color: '#334155',
      background: '#f1f5f9',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 18,
    },
  },
  '& .MuiTypography-root, & span': {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    fontSize: 12,
    color: '#94a3b8',
  },
})

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, full, children } = props
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <BaseErrorBoundary>
      <PageShell className="base-page">
        <Sidebar>
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
        </Sidebar>

        <ContentArea>
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
            }}
          >
            <section style={{ backgroundColor: 'transparent' }}>
              <div className="base-content" style={contentStyle}>
                {children}
              </div>
            </section>
          </div>
        </ContentArea>
      </PageShell>
    </BaseErrorBoundary>
  )
}
