import DnsRounded from '@mui/icons-material/DnsRounded'
import ForkRightRounded from '@mui/icons-material/ForkRightRounded'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import SubjectRounded from '@mui/icons-material/SubjectRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import { Box, ButtonBase, Switch, Typography } from '@mui/material'
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

const Shell = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fontSize: 14,
  color: '#0f172a',
  background: '#f8fafc',
  overflow: 'hidden',
  WebkitFontSmoothing: 'antialiased',
})

const Header = styled(Box)({
  height: 56,
  minHeight: 56,
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  gap: 12,
  borderBottom: '1px solid #e2e8f0',
  background: '#ffffff',
  position: 'relative',
})

const Body = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  padding: 24,
  overflow: 'auto',
})

const Card = styled(Box)({
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  background: '#ffffff',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  padding: 20,
})

const StatusDot = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})<{ active: boolean }>(({ active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: active ? '#10b981' : '#94a3b8',
  flexShrink: 0,
  transition: 'background 0.3s ease',
}))

const QuickActionButton = styled(ButtonBase)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '16px 12px',
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  background: '#ffffff',
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fontSize: 12,
  fontWeight: 500,
  color: '#334155',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: '#f8fafc',
    borderColor: '#cbd5e1',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  '&:active': {
    background: '#f1f5f9',
    transform: 'scale(0.98)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 22,
    color: '#6366f1',
  },
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
      <Header data-tauri-drag-region>
        <StatusDot active={indicator} />
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: '#0f172a',
            letterSpacing: '-0.01em',
          }}
        >
          Clash Verge
        </Typography>
        <Box sx={{ flex: 1 }} data-tauri-drag-region />
        <Typography
          sx={{
            fontSize: 12,
            color: '#94a3b8',
            fontWeight: 500,
          }}
        >
          {dateLabel} &middot; {timeLabel}
        </Typography>
      </Header>

      <Body>
        {/* Proxy Control Card */}
        <Card
          onClick={handleToggleProxy}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: '#cbd5e1',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            },
            '&:active': {
              transform: 'scale(0.99)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: indicator ? '#ecfdf5' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease',
                }}
              >
                <PowerSettingsNewRounded
                  sx={{
                    fontSize: 22,
                    color: indicator ? '#10b981' : '#94a3b8',
                    transition: 'color 0.3s ease',
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#0f172a',
                  }}
                >
                  System Proxy
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: indicator ? '#10b981' : '#94a3b8',
                    fontWeight: 500,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {indicator ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
            </Box>

            <Switch
              checked={indicator}
              onClick={(e) => e.stopPropagation()}
              onChange={handleToggleProxy}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6366f1',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#6366f1',
                },
              }}
            />
          </Box>
        </Card>

        {/* Status Info */}
        <Card>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 1.5,
            }}
          >
            Status
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { label: 'Mode', value: indicator ? 'System Proxy' : 'Direct' },
              { label: 'Route', value: indicator ? 'Global' : '—' },
              { label: 'DNS', value: indicator ? 'Active' : 'Inactive' },
              { label: 'TUN', value: 'Inactive' },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                }}
              >
                <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#0f172a',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

        {/* Quick Actions */}
        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 1.5,
            }}
          >
            Quick Actions
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1.5,
            }}
          >
            {menuItems.map((item) => {
              const label = t(item.labelKey)
              return (
                <QuickActionButton
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  aria-label={label}
                >
                  <item.icon />
                  {label}
                </QuickActionButton>
              )
            })}
          </Box>
        </Box>
      </Body>
    </Shell>
  )
}

export default DashboardPage
