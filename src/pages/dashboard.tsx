import ArrowDownwardRounded from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded'
import DnsRounded from '@mui/icons-material/DnsRounded'
import ForkRightRounded from '@mui/icons-material/ForkRightRounded'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import SubjectRounded from '@mui/icons-material/SubjectRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import { Box, ButtonBase, Switch, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { useTrafficData } from '@/hooks/use-traffic-data'
import parseTraffic from '@/utils/parse-traffic'

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

const MAX_HISTORY = 60

const DashboardPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { indicator, toggleSystemProxy } = useSystemProxyState()
  const { response: trafficData } = useTrafficData()
  const [now, setNow] = useState(() => new Date())
  const uploadHistory = useRef<number[]>([])
  const downloadHistory = useRef<number[]>([])
  const lastSampleTime = useRef(0)
  const [, forceRender] = useState(0)

  useEffect(() => {
    const now2 = Date.now()
    if (now2 - lastSampleTime.current < 1000) return
    lastSampleTime.current = now2
    const up = trafficData.data?.up ?? 0
    const down = trafficData.data?.down ?? 0
    uploadHistory.current.push(up)
    downloadHistory.current.push(down)
    if (uploadHistory.current.length > MAX_HISTORY) uploadHistory.current.shift()
    if (downloadHistory.current.length > MAX_HISTORY) downloadHistory.current.shift()
    forceRender((n) => n + 1)
  }, [trafficData])

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
        {/* Speed Card */}
        <Card
          sx={{
            position: 'relative',
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 50%, #ffffff 100%)',
            border: '1px solid #dbeafe',
            padding: '60px',
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Real-time line chart background */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
          >
            {(() => {
              const upData = uploadHistory.current
              const downData = downloadHistory.current
              const allValues = [...upData, ...downData]
              const maxVal = Math.max(...allValues, 1024)

              const buildPath = (data: number[]) => {
                if (data.length < 2) return ''
                const stepX = 600 / (MAX_HISTORY - 1)
                const offset = MAX_HISTORY - data.length
                return data
                  .map((val, i) => {
                    const x = (offset + i) * stepX
                    const y = 200 - (val / maxVal) * 170 - 10
                    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
                  })
                  .join(' ')
              }

              const buildArea = (data: number[]) => {
                if (data.length < 2) return ''
                const stepX = 600 / (MAX_HISTORY - 1)
                const offset = MAX_HISTORY - data.length
                const linePart = data
                  .map((val, i) => {
                    const x = (offset + i) * stepX
                    const y = 200 - (val / maxVal) * 170 - 10
                    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
                  })
                  .join(' ')
                const lastX = (offset + data.length - 1) * stepX
                const firstX = offset * stepX
                return `${linePart} L ${lastX.toFixed(1)} 200 L ${firstX.toFixed(1)} 200 Z`
              }

              return (
                <>
                  <defs>
                    <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d={buildArea(upData)} fill="url(#uploadGrad)" />
                  <path
                    d={buildPath(upData)}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                  <path d={buildArea(downData)} fill="url(#downloadGrad)" />
                  <path
                    d={buildPath(downData)}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                </>
              )
            })()}
          </svg>

          {/* Speed text overlay */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: 1 }}>
                <ArrowUpwardRounded sx={{ fontSize: 28, color: '#64748b' }} />
                <Typography sx={{ fontSize: 22, color: '#64748b', fontWeight: 500 }}>
                  Upload
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: 72,
                    fontWeight: 700,
                    color: '#1e40af',
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1,
                  }}
                >
                  {parseTraffic(trafficData.data?.up)[0]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 22,
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  {parseTraffic(trafficData.data?.up)[1]}/s
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: 1 }}>
                <ArrowDownwardRounded sx={{ fontSize: 28, color: '#64748b' }} />
                <Typography sx={{ fontSize: 22, color: '#64748b', fontWeight: 500 }}>
                  Download
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: 72,
                    fontWeight: 700,
                    color: '#1e40af',
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1,
                  }}
                >
                  {parseTraffic(trafficData.data?.down)[0]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 22,
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  {parseTraffic(trafficData.data?.down)[1]}/s
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

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
