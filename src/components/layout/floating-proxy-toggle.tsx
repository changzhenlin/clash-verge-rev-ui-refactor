import { PowerSettingsNewRounded } from '@mui/icons-material'
import { Fab, Tooltip, alpha, useTheme } from '@mui/material'
import { useLockFn } from 'ahooks'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { showNotice } from '@/services/notice-service'

const FloatingProxyToggle = memo(() => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { indicator, toggleSystemProxy } = useSystemProxyState()

  const handleToggle = useLockFn(async () => {
    try {
      await toggleSystemProxy(!indicator)
    } catch (err) {
      showNotice.error(err)
    }
  })

  return (
    <Tooltip
      title={
        indicator
          ? t('settings.sections.proxyControl.fields.systemProxy') + ' ON'
          : t('settings.sections.proxyControl.fields.systemProxy') + ' OFF'
      }
      placement="left"
    >
      <Fab
        onClick={handleToggle}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 999,
          width: 72,
          height: 72,
          bgcolor: indicator
            ? alpha(theme.palette.success.main, 0.9)
            : alpha(theme.palette.action.disabled, 0.3),
          color: indicator ? '#fff' : theme.palette.text.secondary,
          boxShadow: indicator
            ? `0 4px 20px ${alpha(theme.palette.success.main, 0.4)}`
            : theme.shadows[4],
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: indicator
              ? theme.palette.success.main
              : alpha(theme.palette.action.disabled, 0.5),
            transform: 'scale(1.1)',
          },
        }}
      >
        <PowerSettingsNewRounded sx={{ fontSize: 36 }} />
      </Fab>
    </Tooltip>
  )
})

export default FloatingProxyToggle
