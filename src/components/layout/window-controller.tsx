import { Close, CropSquare, FilterNone, Minimize } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { forwardRef, useImperativeHandle } from 'react'

import { useWindowControls } from '@/hooks/use-window'
import getSystem from '@/utils/get-system'

export const WindowControls = forwardRef(function WindowControls(props, ref) {
  const OS = getSystem()
  const {
    currentWindow,
    maximized,
    minimize,
    close,
    toggleFullscreen,
    toggleMaximize,
  } = useWindowControls()

  useImperativeHandle(
    ref,
    () => ({
      currentWindow,
      maximized,
      minimize,
      close,
      toggleFullscreen,
      toggleMaximize,
    }),
    [
      currentWindow,
      maximized,
      minimize,
      close,
      toggleFullscreen,
      toggleMaximize,
    ],
  )

  // 通过前端对 tauri 窗口进行翻转全屏时会短暂地与系统图标重叠渲染。
  // 这可能是上游缺陷，保险起见跨平台以窗口的最大化翻转为准。

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        color: 'text.secondary',
        '> button': {
          cursor: 'default',
          width: OS === 'macos' ? 14 : 32,
          height: OS === 'macos' ? 14 : 32,
          border: OS === 'macos' ? '1px solid rgba(0,0,0,0.15)' : undefined,
        },
      }}
    >
      {OS === 'macos' && (
        <>
          {/* macOS 风格：关闭 → 最小化 → 全屏 */}
          <IconButton
            size="small"
            sx={{
              fontSize: 0,
              bgcolor: '#FF5F57',
              ':hover': { bgcolor: '#ff4a42' },
            }}
            onClick={close}
          >
            <Close sx={{ fontSize: 9, opacity: 0 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              fontSize: 0,
              bgcolor: '#FEBC2E',
              ':hover': { bgcolor: '#f0ad19' },
            }}
            onClick={minimize}
          >
            <Minimize sx={{ fontSize: 9, opacity: 0 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              fontSize: 0,
              bgcolor: '#28C840',
              ':hover': { bgcolor: '#20b338' },
            }}
            onClick={toggleMaximize}
          >
            {maximized ? (
              <FilterNone sx={{ fontSize: 9, opacity: 0 }} />
            ) : (
              <CropSquare sx={{ fontSize: 9, opacity: 0 }} />
            )}
          </IconButton>
        </>
      )}

      {OS === 'windows' && (
        <>
          {/* Windows 风格：最小化 → 最大化 → 关闭 */}
          <IconButton size="small" sx={{ fontSize: 16 }} onClick={minimize}>
            <Minimize fontSize="inherit" color="inherit" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ fontSize: 16 }}
            onClick={toggleMaximize}
          >
            {maximized ? (
              <FilterNone fontSize="inherit" color="inherit" />
            ) : (
              <CropSquare fontSize="inherit" color="inherit" />
            )}
          </IconButton>
          <IconButton
            size="small"
            sx={{ fontSize: 16, ':hover': { bgcolor: 'red', color: 'white' } }}
            onClick={close}
          >
            <Close fontSize="inherit" color="inherit" />
          </IconButton>
        </>
      )}

      {OS === 'linux' && (
        <>
          {/* Linux 桌面常见布局（GNOME/KDE 多为：最小化 → 最大化 → 关闭） */}
          <IconButton size="small" sx={{ fontSize: 16 }} onClick={minimize}>
            <Minimize fontSize="inherit" color="inherit" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ fontSize: 16 }}
            onClick={toggleMaximize}
          >
            {maximized ? (
              <FilterNone fontSize="inherit" color="inherit" />
            ) : (
              <CropSquare fontSize="inherit" color="inherit" />
            )}
          </IconButton>
          <IconButton
            size="small"
            sx={{ fontSize: 16, ':hover': { bgcolor: 'red', color: 'white' } }}
            onClick={close}
          >
            <Close fontSize="inherit" color="inherit" />
          </IconButton>
        </>
      )}
    </Box>
  )
})
