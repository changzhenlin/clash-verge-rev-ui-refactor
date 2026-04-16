import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  DnsOutlined,
  PublicRounded,
  HelpOutlineRounded,
  HistoryEduOutlined,
  SettingsOutlined,
  BoltRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useLockFn } from 'ahooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { ClashModeCard } from '@/components/home/clash-mode-card'
import { EnhancedCard } from '@/components/home/enhanced-card'
import { HomeProfileCard } from '@/components/home/home-profile-card'
import { ProxyTunCard } from '@/components/home/proxy-tun-card'
import {
  TrafficGraph,
  type TrafficRef,
} from '@/components/layout/traffic-graph'
import { useAppData } from '@/providers/app-data-context'
import { useConnectionData } from '@/hooks/use-connection-data'
import { useCurrentProxy } from '@/hooks/use-current-proxy'
import { useProfiles } from '@/hooks/use-profiles'
import { useTrafficData } from '@/hooks/use-traffic-data'
import { useVerge } from '@/hooks/use-verge'
import { entry_lightweight_mode, openWebUrl } from '@/services/cmds'
import delayManager from '@/services/delay'
import parseTraffic from '@/utils/parse-traffic'

// 定义首页卡片设置接口
interface HomeCardsSettings {
  profile: boolean
  proxy: boolean
  network: boolean
  mode: boolean
  traffic: boolean
  [key: string]: boolean
}

// 首页设置对话框组件接口
interface HomeSettingsDialogProps {
  open: boolean
  onClose: () => void
  homeCards: HomeCardsSettings
  onSave: (cards: HomeCardsSettings) => void
}

const serializeCardFlags = (cards: HomeCardsSettings) =>
  Object.keys(cards)
    .sort()
    .map((key) => `${key}:${cards[key] ? 1 : 0}`)
    .join('|')

// 首页设置对话框组件
const HomeSettingsDialog = ({
  open,
  onClose,
  homeCards,
  onSave,
}: HomeSettingsDialogProps) => {
  const { t } = useTranslation()
  const [cards, setCards] = useState<HomeCardsSettings>(homeCards)
  const { patchVerge } = useVerge()

  const handleToggle = (key: string) => {
    setCards((prev: HomeCardsSettings) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    await patchVerge({ home_cards: cards })
    onSave(cards)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('home.page.settings.title')}</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={cards.profile || false}
                onChange={() => handleToggle('profile')}
              />
            }
            label={t('home.page.settings.cards.profile')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cards.proxy || false}
                onChange={() => handleToggle('proxy')}
              />
            }
            label={t('home.page.settings.cards.currentProxy')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cards.network || false}
                onChange={() => handleToggle('network')}
              />
            }
            label={t('home.page.settings.cards.network')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cards.mode || false}
                onChange={() => handleToggle('mode')}
              />
            }
            label={t('home.page.settings.cards.proxyMode')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cards.traffic || false}
                onChange={() => handleToggle('traffic')}
              />
            }
            label={t('home.page.settings.cards.traffic')}
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('shared.actions.cancel')}</Button>
        <Button onClick={handleSave} color="primary">
          {t('shared.actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const codeToFlag = (countryCode?: string) => {
  if (!countryCode || countryCode.length !== 2) return '🌐'
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0)),
  )
}

const inferFlagFromName = (name?: string | null) => {
  if (!name) return '🌐'

  const normalized = name.toLowerCase()
  const regionMap: Array<[string[], string]> = [
    [['hong kong', 'hk', '香港'], 'HK'],
    [['singapore', 'sg', '新加坡'], 'SG'],
    [['tokyo', 'japan', 'jp', '日本'], 'JP'],
    [['us', 'united states', 'america', '美'], 'US'],
    [['london', 'uk', 'britain', '英国'], 'GB'],
    [['frankfurt', 'germany', 'de', '德国'], 'DE'],
    [['korea', 'kr', '首尔', '韩国'], 'KR'],
    [['taiwan', 'tw', '台湾'], 'TW'],
  ]

  const matched = regionMap.find(([keywords]) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  )

  return codeToFlag(matched?.[1])
}

const normalizeNodeName = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim()
  }
  if (
    value &&
    typeof value === 'object' &&
    'name' in value &&
    typeof value.name === 'string'
  ) {
    return value.name.trim()
  }
  return ''
}

const GlassPanel = ({
  children,
  hover = false,
}: {
  children: React.ReactNode
  hover?: boolean
}) => (
  <Box
    sx={{
      borderRadius: 3,
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(26, 26, 26, 0.6)',
      backdropFilter: 'blur(20px) saturate(150%)',
      boxShadow:
        '0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      transition: 'transform 0.2s ease, background-color 0.2s ease',
      ...(hover
        ? {
            '&:hover': {
              transform: 'translateY(-2px) scale(1.02)',
              background: 'rgba(30, 30, 30, 0.7)',
            },
          }
        : {}),
    }}
  >
    {children}
  </Box>
)

const DashboardOverview = ({ showTraffic }: { showTraffic: boolean }) => {
  const theme = useTheme()
  const {
    response: { data: traffic },
  } = useTrafficData()
  const trafficRef = useRef<TrafficRef>(null)

  const [up, upUnit] = parseTraffic(traffic?.up || 0)
  const [down, downUnit] = parseTraffic(traffic?.down || 0)

  useEffect(() => {
    if (trafficRef.current && showTraffic) {
      trafficRef.current.appendData({
        up: traffic?.up || 0,
        down: traffic?.down || 0,
      })
    }
  }, [showTraffic, traffic])

  return (
    <GlassPanel>
      <Box sx={{ p: 2.5 }}>
        {showTraffic ? (
          <Box sx={{ height: 156, mb: 2.25, mx: -0.5 }}>
            <TrafficGraph ref={trafficRef} />
          </Box>
        ) : null}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            pt: 1.5,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArrowUpwardRounded
              sx={{ fontSize: 14, color: theme.palette.success.main }}
            />
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              Upload
            </Typography>
            <Typography
              sx={{
                ml: 1,
                fontSize: 12,
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'monospace',
              }}
            >
              {`${up} ${upUnit}/s`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArrowDownwardRounded
              sx={{ fontSize: 14, color: theme.palette.info.main }}
            />
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              Download
            </Typography>
            <Typography
              sx={{
                ml: 1,
                fontSize: 12,
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'monospace',
              }}
            >
              {`${down} ${downUnit}/s`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </GlassPanel>
  )
}

const QuickNodeSwitch = ({ visible }: { visible: boolean }) => {
  const navigate = useNavigate()
  const { proxies } = useAppData()
  const { currentProxy, primaryGroupName } = useCurrentProxy()

  const groupName = primaryGroupName || 'GLOBAL'

  const nodes = useMemo<
    Array<{
      name: string
      latency: number
      isActive: boolean
      flag: string
    }>
  >(() => {
    if (!visible || !proxies) return []

    const sourceGroup =
      groupName === 'GLOBAL'
        ? proxies.global
        : proxies.groups?.find((group: any) => group.name === groupName)

    const options = (Array.isArray(sourceGroup?.all) ? sourceGroup.all : [])
      .map((item: unknown) => normalizeNodeName(item))
      .filter((name: string): name is string => Boolean(name))
      .filter((name: string) => !['DIRECT', 'REJECT'].includes(name))
      .slice(0, 6)

    return options.map((name: string) => {
      const record = proxies.records?.[name]
      const latency = record ? delayManager.getDelayFix(record, groupName) : -1
      return {
        name,
        latency,
        isActive: currentProxy?.name === name,
        flag: inferFlagFromName(name),
      }
    })
  }, [currentProxy?.name, groupName, proxies, visible])

  if (!visible || nodes.length === 0) return null

  return (
    <Box>
      <Typography
        sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', mb: 1.25 }}
      >
        Quick Node Switch
      </Typography>
      <Grid container spacing={1.5} columns={{ xs: 1, md: 3 }}>
        {nodes.map((node) => (
          <Grid key={node.name} size={1}>
            <GlassPanel hover>
              <Box
                onClick={() => navigate('/proxies')}
                sx={{ p: 2.25, cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.75,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 22,
                      fontFamily: '"twemoji mozilla", sans-serif',
                    }}
                  >
                    {node.flag}
                  </Typography>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: node.isActive
                        ? '#4ADE80'
                        : 'rgba(255,255,255,0.2)',
                    }}
                  />
                </Box>
                <Typography
                  sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', mb: 0.75 }}
                >
                  {node.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      backgroundColor:
                        node.latency <= 0
                          ? 'rgba(255,255,255,0.24)'
                          : node.latency < 50
                            ? '#4ADE80'
                            : node.latency < 150
                              ? '#FACC15'
                              : '#F87171',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.5)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {node.latency > 0 ? `${node.latency}ms` : '--'}
                  </Typography>
                </Box>
              </Box>
            </GlassPanel>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

const HomePage = () => {
  const { t } = useTranslation()
  const { verge } = useVerge()
  const { current, mutateProfiles } = useProfiles()

  // 设置弹窗的状态
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [localHomeCards, setLocalHomeCards] = useState<{
    value: HomeCardsSettings
    baseSignature: string
  } | null>(null)

  // 卡片显示状态
  const defaultCards = useMemo<HomeCardsSettings>(
    () => ({
      profile: true,
      proxy: true,
      network: true,
      mode: true,
      traffic: true,
    }),
    [],
  )

  const vergeHomeCards = useMemo<HomeCardsSettings | null>(
    () => (verge?.home_cards as HomeCardsSettings | undefined) ?? null,
    [verge],
  )

  const remoteHomeCards = useMemo<HomeCardsSettings>(
    () => vergeHomeCards ?? defaultCards,
    [defaultCards, vergeHomeCards],
  )

  const remoteSignature = useMemo(
    () => serializeCardFlags(remoteHomeCards),
    [remoteHomeCards],
  )

  const pendingLocalCards = useMemo<HomeCardsSettings | null>(() => {
    if (!localHomeCards) return null
    return localHomeCards.baseSignature === remoteSignature
      ? localHomeCards.value
      : null
  }, [localHomeCards, remoteSignature])

  const effectiveHomeCards = pendingLocalCards ?? remoteHomeCards

  // 文档链接函数
  const toGithubDoc = useLockFn(() => {
    return openWebUrl('https://clash-verge-rev.github.io/index.html')
  })

  // 新增：打开设置弹窗
  const openSettings = useCallback(() => {
    setSettingsOpen(true)
  }, [])

  const renderCard = useCallback(
    (cardKey: string, component: React.ReactNode, size: number = 6) => {
      if (!effectiveHomeCards[cardKey]) return null

      return (
        <Grid size={size} key={cardKey}>
          {component}
        </Grid>
      )
    },
    [effectiveHomeCards],
  )

  const criticalCards = useMemo(
    () => [
      renderCard(
        'profile',
        <HomeProfileCard current={current} onProfileUpdated={mutateProfiles} />,
      ),
      renderCard('network', <NetworkSettingsCard />),
    ],
    [current, mutateProfiles, renderCard],
  )

  // 新增：保存设置时用requestIdleCallback/setTimeout
  const handleSaveSettings = (newCards: HomeCardsSettings) => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() =>
        setLocalHomeCards({
          value: newCards,
          baseSignature: remoteSignature,
        }),
      )
    } else {
      setTimeout(
        () =>
          setLocalHomeCards({
            value: newCards,
            baseSignature: remoteSignature,
          }),
        0,
      )
    }
  }

  const dialogKey = useMemo(
    () => `${serializeCardFlags(effectiveHomeCards)}:${settingsOpen ? 1 : 0}`,
    [effectiveHomeCards, settingsOpen],
  )
  return (
    <Box
      sx={{
        p: 2,
        minHeight: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >


      <Box sx={{ mb: 2 }}>
        <DashboardOverview showTraffic={effectiveHomeCards.traffic} />
      </Box>

      <Grid container spacing={1.5} columns={{ xs: 6, sm: 6, md: 12 }}>
        {criticalCards}
      </Grid>

      <HomeSettingsDialog
        key={dialogKey}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        homeCards={effectiveHomeCards}
        onSave={handleSaveSettings}
      />
    </Box>
  )
}

// 增强版网络设置卡片组件
const NetworkSettingsCard = () => {
  const { t } = useTranslation()
  return (
    <EnhancedCard
      title={t('home.page.cards.networkSettings')}
      icon={<DnsOutlined />}
      iconColor="primary"
      action={null}
    >
      <ProxyTunCard />
    </EnhancedCard>
  )
}

export default HomePage
