import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, IconButton, Typography } from '@mui/material'
import { styled, keyframes } from '@mui/material/styles'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import DnsRounded from '@mui/icons-material/DnsRounded'
import ForkRightRounded from '@mui/icons-material/ForkRightRounded'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import SubjectRounded from '@mui/icons-material/SubjectRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import { useSystemProxyState } from '@/hooks/use-system-proxy-state'

// 菜单项配置 - 每个按钮不同的颜色
const menuItems = [
  { icon: WifiRounded, label: 'Proxies', path: '/proxies', angle: 0, color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' },
  { icon: DnsRounded, label: 'Profiles', path: '/profiles', angle: 60, color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4 0%, #7EDDD7 100%)' },
  { icon: ForkRightRounded, label: 'Rules', path: '/rules', angle: 120, color: '#45B7D1', gradient: 'linear-gradient(135deg, #45B7D1 0%, #74C7E3 100%)' },
  { icon: LanguageRounded, label: 'Connections', path: '/connections', angle: 180, color: '#96CEB4', gradient: 'linear-gradient(135deg, #96CEB4 0%, #B5D4C2 100%)' },
  { icon: SubjectRounded, label: 'Logs', path: '/logs', angle: 240, color: '#FFEAA7', gradient: 'linear-gradient(135deg, #FDCB6E 0%, #FFEAA7 100%)' },
  { icon: SettingsRounded, label: 'Settings', path: '/settings', angle: 300, color: '#DDA0DD', gradient: 'linear-gradient(135deg, #DDA0DD 0%, #E8C4E8 100%)' },
]

// 背景流动动画
const gradientFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

// 呼吸动画
const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
`

const DashboardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  background: active
    ? 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #FF6B6B, #4ECDC4, #45B7D1)'
    : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  backgroundSize: active ? '400% 400%' : '100% 100%',
  animation: active ? `${gradientFlow} 15s ease infinite` : 'none',
  transition: 'all 0.5s ease',
}))

const CenterContainer = styled(Box)({
  position: 'relative',
  width: 500,
  height: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const LabelText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color?: string }>(({ color }) => ({
  position: 'absolute',
  top: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '48px',
  fontWeight: 700,
  letterSpacing: '4px',
  textTransform: 'uppercase',
  background: color || 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 0 30px rgba(255,255,255,0.3)',
  zIndex: 30,
  transition: 'all 0.3s ease',
}))

const MainButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: 200,
  height: 200,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  background: active
    ? 'linear-gradient(135deg, #2f7cf6 0%, #5aa8ff 100%)'
    : 'linear-gradient(135deg, #555 0%, #777 100%)',
  boxShadow: active
    ? `0 25px 80px ${theme.palette.mode === 'dark' ? 'rgba(47, 124, 246, 0.6)' : 'rgba(47, 124, 246, 0.5)'}, inset 0 2px 4px rgba(255,255,255,0.3)`
    : `0 25px 80px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)'}, inset 0 2px 4px rgba(255,255,255,0.2)`,
  animation: `${breathe} 3s ease-in-out infinite`,
  zIndex: 10,
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}))

const MenuItemWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'angle',
})<{ angle: number }>(({ angle }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 0,
  height: 0,
  transform: `rotate(${angle}deg) translateX(170px)`,
  transformOrigin: '0 0',
  zIndex: 20,
}))

const MenuItemButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'gradient' && prop !== 'shadowColor',
})<{ gradient: string; shadowColor: string }>(({ gradient, shadowColor }) => ({
  width: 80,
  height: 80,
  background: gradient,
  backdropFilter: 'blur(10px)',
  color: '#fff',
  position: 'absolute',
  left: 0,
  top: 0,
  transform: 'translate(-50%, -50%)',
  boxShadow: `0 10px 40px ${shadowColor}60`,
  border: '2px solid rgba(255,255,255,0.3)',
  '&:hover': {
    boxShadow: `0 15px 50px ${shadowColor}80`,
    border: '2px solid rgba(255,255,255,0.5)',
  },
}))

const DashboardPage = () => {
  const navigate = useNavigate()
  const { indicator, toggleSystemProxy } = useSystemProxyState()
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)

  const handleToggleProxy = useCallback(() => {
    toggleSystemProxy(!indicator)
  }, [indicator, toggleSystemProxy])

  const handleMenuClick = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  const handleMouseEnter = (label: string, color: string) => {
    setHoveredLabel(label)
    setHoveredColor(color)
  }

  const handleMouseLeave = () => {
    setHoveredLabel(null)
    setHoveredColor(null)
  }

  return (
    <DashboardContainer active={indicator}>
      {/* 大标题 - 显示悬停的菜单项名称 */}
      {hoveredLabel && hoveredColor && (
        <LabelText color={hoveredColor}>
          {hoveredLabel}
        </LabelText>
      )}

      <CenterContainer>
        {/* 六个菜单按钮 - 始终显示 */}
        {menuItems.map((item) => (
          <MenuItemWrapper key={item.path} angle={item.angle}>
            <MenuItemButton
              gradient={item.gradient}
              shadowColor={item.color}
              onClick={() => handleMenuClick(item.path)}
              onMouseEnter={() => handleMouseEnter(item.label, item.gradient)}
              onMouseLeave={handleMouseLeave}
            >
              <item.icon sx={{ fontSize: 36 }} />
            </MenuItemButton>
          </MenuItemWrapper>
        ))}

        {/* 主开关按钮 */}
        <MainButton
          active={indicator}
          onClick={handleToggleProxy}
        >
          <PowerSettingsNewRounded
            sx={{
              fontSize: 90,
              color: '#fff',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />
        </MainButton>
      </CenterContainer>
    </DashboardContainer>
  )
}

export default DashboardPage
