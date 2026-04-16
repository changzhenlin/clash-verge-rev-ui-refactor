import { Typography } from '@mui/material'
import React, { ReactNode } from 'react'

import { BaseErrorBoundary } from './base-error-boundary'

interface Props {
  title?: React.ReactNode // the page title
  header?: React.ReactNode // something behind title
  contentStyle?: React.CSSProperties
  children?: ReactNode
  full?: boolean
}

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, full, children } = props

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
      </div>
    </BaseErrorBoundary>
  )
}
