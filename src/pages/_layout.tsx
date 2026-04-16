import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  PowerSettingsNewRounded,
  HomeRounded,
  DnsRounded,
  WifiRounded,
  ForkRightRounded,
  LanguageRounded,
  SubjectRounded,
  SettingsRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  List,
  Menu,
  MenuItem,
  Paper,
  ThemeProvider,
  Typography,
  alpha,
} from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { BaseErrorBoundary } from '@/components/base'
import { LayoutItem } from '@/components/layout/layout-item'
import { NoticeManager } from '@/components/layout/notice-manager'
import { WindowControls } from '@/components/layout/window-controller'
import { useI18n } from '@/hooks/use-i18n'
import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { useVerge } from '@/hooks/use-verge'
import { useWindowDecorations } from '@/hooks/use-window'
import { useThemeMode } from '@/services/states'
import getSystem from '@/utils/get-system'

import {
  useCustomTheme,
  useLayoutEvents,
  useLoadingOverlay,
  useNavMenuOrder,
} from './_layout/hooks'
import { handleNoticeMessage } from './_layout/utils'
import { navItems } from './_routers'
import LogsPage from './logs'

import 'dayjs/locale/ru'
import 'dayjs/locale/zh-cn'

export const portableFlag = false

type NavItem = (typeof navItems)[number]

type MenuContextPosition = { top: number; left: number }

interface SortableNavMenuItemProps {
  item: NavItem
  label: string
}

const SortableNavMenuItem = ({ item, label }: SortableNavMenuItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.path,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    style.zIndex = 100
  }

  return (
    <LayoutItem
      to={item.path}
      icon={item.icon}
      sortable={{
        setNodeRef,
        attributes,
        listeners,
        style,
        isDragging,
      }}
    >
      {label}
    </LayoutItem>
  )
}

dayjs.extend(relativeTime)

const OS = getSystem()

const AppShellHeader = ({
  decorated,
  windowControlsRef,
  pathname,
  navigate,
}: {
  decorated: boolean
  windowControlsRef: React.RefObject<any>
  pathname: string
  navigate: (path: string) => void
}) => {
  const { t } = useTranslation()
  const { indicator, toggleSystemProxy } = useSystemProxyState()

  const handleToggleProxy = useCallback(() => {
    toggleSystemProxy(!indicator)
  }, [indicator, toggleSystemProxy])

  return (
    <Box
      className="app-shell-header"
      data-tauri-drag-region="true"
      sx={{
        height: 56,
        px: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(15, 15, 15, 0.95)',
        backdropFilter: 'blur(40px) saturate(180%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
        {!decorated && OS === 'macos' ? (
          <Box data-tauri-drag-region="false">
            <WindowControls ref={windowControlsRef} />
          </Box>
        ) : null}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={pathname === '/' ? 'contained' : 'text'}
            size="small"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2,
              py: 0.75,
              fontSize: 12,
              fontWeight: 500,
              ...(pathname === '/' && {
                background: 'linear-gradient(90deg, #2f7cf6 0%, #5aa8ff 100%)',
                color: '#fff',
              }),
            }}
          >
            Proxies
          </Button>
          <Button
            variant={pathname === '/profile' ? 'contained' : 'text'}
            size="small"
            onClick={() => navigate('/profile')}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2,
              py: 0.75,
              fontSize: 12,
              fontWeight: 500,
              ...(pathname === '/profile' && {
                background: 'linear-gradient(90deg, #2f7cf6 0%, #5aa8ff 100%)',
                color: '#fff',
              }),
            }}
          >
            Profiles
          </Button>
          <Button
            variant={pathname === '/rules' ? 'contained' : 'text'}
            size="small"
            onClick={() => navigate('/rules')}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2,
              py: 0.75,
              fontSize: 12,
              fontWeight: 500,
              ...(pathname === '/rules' && {
                background: 'linear-gradient(90deg, #2f7cf6 0%, #5aa8ff 100%)',
                color: '#fff',
              }),
            }}
          >
            Rules
          </Button>
          <Button
            variant={pathname === '/connections' ? 'contained' : 'text'}
            size="small"
            onClick={() => navigate('/connections')}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2,
              py: 0.75,
              fontSize: 12,
              fontWeight: 500,
              ...(pathname === '/connections' && {
                background: 'linear-gradient(90deg, #2f7cf6 0%, #5aa8ff 100%)',
                color: '#fff',
              }),
            }}
          >
            Connections
          </Button>
          <Button
            variant={pathname === '/logs' ? 'contained' : 'text'}
            size="small"
            onClick={() => navigate('/logs')}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2,
              py: 0.75,
              fontSize: 12,
              fontWeight: 500,
              ...(pathname === '/logs' && {
                background: 'linear-gradient(90deg, #2f7cf6 0%, #5aa8ff 100%)',
                color: '#fff',
              }),
            }}
          >
            Logs
          </Button>
          <Button
            variant={pathname === '/settings' ? 'contained' : 'text'}
            size="small"
            onClick={() => navigate('/settings')}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2,
              py: 0.75,
              fontSize: 12,
              fontWeight: 500,
              ...(pathname === '/settings' && {
                background: 'linear-gradient(90deg, #2f7cf6 0%, #5aa8ff 100%)',
                color: '#fff',
              }),
            }}
          >
            Settings
          </Button>
        </Box>
      </Box>

      <Box
        data-tauri-drag-region="false"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          ml: 'auto',
        }}
      >
        <Button
          variant="contained"
          disableElevation
          startIcon={<PowerSettingsNewRounded />}
          onClick={handleToggleProxy}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 0.85,
            minWidth: 0,
            textTransform: 'none',
            fontSize: 12,
            fontWeight: 500,
            color: '#fff',
            background: indicator
              ? 'linear-gradient(90deg, #2f7cf6 0%, #5aa8ff 100%)'
              : 'linear-gradient(90deg, #666 0%, #888 100%)',
            boxShadow: indicator
              ? `0 12px 32px ${alpha('#2f7cf6', 0.32)}`
              : `0 12px 32px ${alpha('#666', 0.32)}`,
          }}
        >
          {indicator ? 'Open' : 'Close'}
        </Button>
        {!decorated && OS !== 'macos' ? (
          <Box data-tauri-drag-region="false">
            <WindowControls ref={windowControlsRef} />
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}



const Layout = () => {
  const mode = useThemeMode()
  const { t } = useTranslation()
  const { theme } = useCustomTheme()
  const { verge, mutateVerge, patchVerge } = useVerge()
  const { language } = verge ?? {}
  const navCollapsed = verge?.collapse_navbar ?? false
  const { switchLanguage } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isLogsPage = pathname === '/logs'
  const logsPageMountedRef = useRef(false)
  if (isLogsPage) logsPageMountedRef.current = true
  const themeReady = useMemo(() => Boolean(theme), [theme])

  const [menuUnlocked, setMenuUnlocked] = useState(false)
  const [menuContextPosition, setMenuContextPosition] =
    useState<MenuContextPosition | null>(null)
  const visibleNavItems = useMemo(
    () => navItems.filter((item) => item.section !== 'hidden'),
    [],
  )

  const windowControlsRef = useRef<any>(null)
  const { decorated } = useWindowDecorations()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleMenuOrderOptimisticUpdate = useCallback(
    (order: string[]) => {
      mutateVerge(
        (prev) => (prev ? { ...prev, menu_order: order } : prev),
        false,
      )
    },
    [mutateVerge],
  )

  const handleMenuOrderPersist = useCallback(
    (order: string[]) => patchVerge({ menu_order: order }),
    [patchVerge],
  )

  const {
    menuOrder,
    navItemMap,
    handleMenuDragEnd,
    isDefaultOrder,
    resetMenuOrder,
  } = useNavMenuOrder({
    enabled: menuUnlocked,
    items: visibleNavItems,
    storedOrder: verge?.menu_order,
    onOptimisticUpdate: handleMenuOrderOptimisticUpdate,
    onPersist: handleMenuOrderPersist,
  })

  const primaryMenuPaths = useMemo(
    () =>
      menuOrder.filter((path) => navItemMap.get(path)?.section === 'primary'),
    [menuOrder, navItemMap],
  )
  const secondaryMenuPaths = useMemo(
    () =>
      menuOrder.filter((path) => navItemMap.get(path)?.section === 'secondary'),
    [menuOrder, navItemMap],
  )

  const handleMenuContextMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setMenuContextPosition({ top: event.clientY, left: event.clientX })
    },
    [],
  )

  const handleMenuContextClose = useCallback(() => {
    setMenuContextPosition(null)
  }, [])

  const handleResetMenuOrder = useCallback(() => {
    setMenuContextPosition(null)
    void resetMenuOrder()
  }, [resetMenuOrder])

  const handleUnlockMenu = useCallback(() => {
    setMenuUnlocked(true)
    setMenuContextPosition(null)
  }, [])

  const handleLockMenu = useCallback(() => {
    setMenuUnlocked(false)
    setMenuContextPosition(null)
  }, [])

  const handleToggleNavCollapsed = useCallback(() => {
    setMenuContextPosition(null)
    void patchVerge({ collapse_navbar: !navCollapsed })
  }, [navCollapsed, patchVerge])

  useLoadingOverlay(themeReady)

  const handleNotice = useCallback(
    (payload: [string, string]) => {
      const [status, msg] = payload
      try {
        handleNoticeMessage(status, msg, t, navigate)
      } catch (error) {
        console.error('[通知处理] 失败:', error)
      }
    },
    [t, navigate],
  )

  useLayoutEvents(handleNotice)

  useEffect(() => {
    if (language) {
      dayjs.locale(language === 'zh' ? 'zh-cn' : language)
      switchLanguage(language)
    }
  }, [language, switchLanguage])

  if (!themeReady) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: mode === 'light' ? '#fff' : '#181a1b',
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: mode === 'light' ? '#333' : '#fff',
        }}
      ></div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      {/* 左侧底部窗口控制按钮 */}
      <NoticeManager position={verge?.notice_position} />
      <div
        style={{
          animation: 'fadeIn 0.5s',
          WebkitAnimation: 'fadeIn 0.5s',
        }}
      />
      <style>
        {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
      </style>
      <Paper
        square
        elevation={0}
        className={`${OS} layout${navCollapsed ? ' layout--nav-collapsed' : ''}`}
        style={{
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
        }}
        onContextMenu={(e) => {
          if (
            OS === 'windows' &&
            !['input', 'textarea'].includes(
              e.currentTarget.tagName.toLowerCase(),
            ) &&
            !e.currentTarget.isContentEditable
          ) {
            e.preventDefault()
          }
        }}
        sx={[
          () => ({
            bgcolor: 'transparent',
            color: 'text.primary',
            backgroundImage: 'none',
          }),
          OS === 'linux'
            ? {
                borderRadius: '8px',
                width: '100vw',
                height: '100vh',
              }
            : {},
        ]}
      >
        <div className="layout-content">
          <div className="layout-content__right" style={{ flex: 1, width: '100%' }}>
            <AppShellHeader
              decorated={Boolean(decorated)}
              windowControlsRef={windowControlsRef}
              pathname={pathname}
              navigate={navigate}
            />
            <div className="the-content">
              <BaseErrorBoundary>
                <Outlet />
              </BaseErrorBoundary>
              {logsPageMountedRef.current && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: isLogsPage ? undefined : 'none',
                  }}
                >
                  <LogsPage />
                </div>
              )}
            </div>
          </div>
        </div>
      </Paper>
    </ThemeProvider>
  )
}

export default Layout