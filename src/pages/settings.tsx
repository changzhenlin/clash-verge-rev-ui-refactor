import { Box, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { BasePage } from '@/components/base'
import SettingClash from '@/components/setting/setting-clash'
import SettingSystem from '@/components/setting/setting-system'
import SettingVergeAdvanced from '@/components/setting/setting-verge-advanced'
import SettingVergeBasic from '@/components/setting/setting-verge-basic'
import { showNotice } from '@/services/notice-service'
import { retroColors as c } from '@/styles/retro-theme'

const retroCardSx = {
  borderRadius: '4px',
  border: `1px solid ${c.borderMid}`,
  background: `linear-gradient(180deg, ${c.creamDark} 0%, #d8d0c0 100%)`,
  boxShadow: `inset 0 1px 0 ${c.highlight}, 0 2px 6px ${c.insetShadow}`,
  padding: 0,
}

const SettingPage = () => {
  const { t } = useTranslation()

  const onError = (err: any) => {
    showNotice.error(err)
  }

  return (
    <BasePage>

      <Grid container spacing={1.5} columns={{ xs: 6, sm: 6, md: 12 }}>
        <Grid size={6}>
          <Box
            sx={{
              ...retroCardSx,
              marginBottom: 1.5,
            }}
          >
            <SettingSystem onError={onError} />
          </Box>
          <Box sx={retroCardSx}>
            <SettingClash onError={onError} />
          </Box>
        </Grid>
        <Grid size={6}>
          <Box
            sx={{
              ...retroCardSx,
              marginBottom: 1.5,
            }}
          >
            <SettingVergeBasic onError={onError} />
          </Box>
          <Box sx={retroCardSx}>
            <SettingVergeAdvanced onError={onError} />
          </Box>
        </Grid>
      </Grid>
    </BasePage>
  )
}

export default SettingPage
