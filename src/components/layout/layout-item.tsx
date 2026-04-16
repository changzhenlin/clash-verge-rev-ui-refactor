import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core'
import {
  alpha,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import type { CSSProperties, ReactNode } from 'react'
import { useMatch, useNavigate, useResolvedPath } from 'react-router'

import { useVerge } from '@/hooks/use-verge'

interface SortableProps {
  setNodeRef?: (element: HTMLElement | null) => void
  attributes?: DraggableAttributes
  listeners?: DraggableSyntheticListeners
  style?: CSSProperties
  isDragging?: boolean
  disabled?: boolean
}

interface Props {
  to: string
  children: string
  icon: ReactNode[]
  sortable?: SortableProps
}
export const LayoutItem = (props: Props) => {
  const { to, children, icon, sortable } = props
  const { verge } = useVerge()
  const { menu_icon } = verge ?? {}
  const navCollapsed = verge?.collapse_navbar ?? false
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })
  const navigate = useNavigate()

  const effectiveMenuIcon =
    navCollapsed && menu_icon === 'disable' ? 'monochrome' : menu_icon

  const { setNodeRef, attributes, listeners, style, isDragging, disabled } =
    sortable ?? {}

  const draggable = Boolean(sortable) && !disabled
  const dragHandleProps = draggable
    ? { ...(attributes ?? {}), ...(listeners ?? {}) }
    : undefined

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={[
        { py: 0.25, maxWidth: 999, mx: 'auto', padding: '2px 0px' },
        isDragging ? { opacity: 0.78 } : {},
      ]}
    >
      <ListItemButton
        selected={!!match}
        {...(dragHandleProps ?? {})}
        sx={[
          {
            borderRadius: 3,
            marginLeft: 0,
            paddingLeft: 1.5,
            paddingRight: 1.5,
            marginRight: 0,
            minHeight: 44,
            cursor: draggable ? 'grab' : 'pointer',
            justifyContent: 'flex-start',
            color: 'rgba(255,255,255,0.6)',
            '&:active': draggable ? { cursor: 'grabbing' } : {},
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.9)',
            },
            '& .MuiListItemText-primary': {
              color: 'inherit',
              fontWeight: 500,
              letterSpacing: 0,
              fontSize: 14,
            },
          },
          ({ palette: { mode, primary } }) => {
            const background =
              mode === 'light'
                ? `linear-gradient(90deg, ${alpha(primary.main, 0.18)} 0%, ${alpha(primary.main, 0.08)} 100%)`
                : `linear-gradient(90deg, ${alpha(primary.main, 0.5)} 0%, ${alpha(primary.main, 0.3)} 100%)`
            const color = mode === 'light' ? '#111827' : '#ffffff'
            return {
              '&.Mui-selected': {
                background,
                color,
                boxShadow: `0 12px 28px ${alpha(primary.main, mode === 'light' ? 0.14 : 0.25)}`,
              },
              '&.Mui-selected:hover': { background },
              '&.Mui-selected .MuiListItemText-primary': { color },
            }
          },
        ]}
        title={navCollapsed ? children : undefined}
        aria-label={navCollapsed ? children : undefined}
        onClick={() => navigate(to)}
      >
        {(effectiveMenuIcon === 'monochrome' || !effectiveMenuIcon) && (
          <ListItemIcon
            sx={{
              color: 'inherit',
              minWidth: 0,
              marginRight: '12px',
              marginLeft: 0,
              cursor: draggable ? 'grab' : 'inherit',
            }}
          >
            {icon[0]}
          </ListItemIcon>
        )}
        {effectiveMenuIcon === 'colorful' && (
          <ListItemIcon sx={{ cursor: draggable ? 'grab' : 'inherit' }}>
            {icon[1]}
          </ListItemIcon>
        )}
        <ListItemText
          sx={{
            textAlign: 'left',
            marginLeft: 0,
          }}
          primary={children}
        />
      </ListItemButton>
    </ListItem>
  )
}