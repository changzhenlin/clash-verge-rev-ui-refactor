import { Typography, Fab, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import HomeRounded from '@mui/icons-material/HomeRounded'
import React, { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router'

import { BaseErrorBoundary } from './base-error-boundary'

interface Props {
  title?: React.ReactNode // the page title
  header?: React.ReactNode // something behind title
  contentStyle?: React.CSSProperties
  children?: ReactNode
  full?: boolean
}

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(135deg, #2f7cf6 0%, #5aa8ff 100%)',
  color: '#fff',
  boxShadow: '0 8px 32px rgba(47, 124, 246, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1e6ae0 0%, #4a9af0 100%)',
    boxShadow: '0 12px 40px rgba(47, 124, 246, 0.5)',
    transform: 'translateX(-50%) scale(1.1)',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 100,
}))

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, full, children } = props
  const navigate = useNavigate()
  const location = useLocation()
  
  // 在首页不显示返回按钮
  const showBackButton = location.pathname !== '/'

  return (
    <BaseErrorBoundary>
      <div className="base-page">
        {(title || header) && (
          <header data-tauri-drag-region="true" style={{ userSelect: 'none' }}>
            <Typography
              sx={{
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'text.primary',
              }}
              data-tauri-drag-region="true"
            >
              {title}
            </Typography>

            {header}
          </header>
        )}

        <div
          className={full ? 'base-container no-padding' : 'base-container'}
          style={{ backgroundColor: 'transparent' }}
        >
          <section
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </div>
        
        {/* 返回首页按钮 */}
        {showBackButton && (
          <Tooltip title="Back to Home" placement="top" arrow>
            <StyledFab
              size="medium"
              onClick={() => navigate('/')}
              aria-label="back to home"
            >
              <HomeRounded />
            </StyledFab>
          </Tooltip>
        )}
      </div>
    </BaseErrorBoundary>
  )
}
