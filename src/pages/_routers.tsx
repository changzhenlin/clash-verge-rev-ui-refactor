import DnsRoundedIcon from '@mui/icons-material/DnsRounded'
import ForkRightRoundedIcon from '@mui/icons-material/ForkRightRounded'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import WifiRoundedIcon from '@mui/icons-material/WifiRounded'
import { createBrowserRouter, RouteObject } from 'react-router'

import ConnectionsSvg from '@/assets/image/itemicon/connections.svg?react'
import HomeSvg from '@/assets/image/itemicon/home.svg?react'
import LogsSvg from '@/assets/image/itemicon/logs.svg?react'
import ProfilesSvg from '@/assets/image/itemicon/profiles.svg?react'
import ProxiesSvg from '@/assets/image/itemicon/proxies.svg?react'
import RulesSvg from '@/assets/image/itemicon/rules.svg?react'
import SettingsSvg from '@/assets/image/itemicon/settings.svg?react'
import UnlockSvg from '@/assets/image/itemicon/unlock.svg?react'

import Layout from './_layout'
import ConnectionsPage from './connections'
import DashboardPage from './dashboard'
import ProfilesPage from './profiles'
import ProxiesPage from './proxies'
import RulesPage from './rules'
import SettingsPage from './settings'
import UnlockPage from './unlock'

export const navItems = [
  {
    displayLabel: 'Dashboard',
    label: 'Dashboard',
    path: '/',
    section: 'primary',
    icon: [<HomeSvg key="svg" />],
    Component: DashboardPage,
  },
  {
    displayLabel: 'Proxies',
    label: 'layout.components.navigation.tabs.proxies',
    path: '/proxies',
    section: 'primary',
    icon: [<WifiRoundedIcon key="mui" />, <ProxiesSvg key="svg" />],
    Component: ProxiesPage,
  },
  {
    displayLabel: 'Profiles',
    label: 'layout.components.navigation.tabs.profiles',
    path: '/profiles',
    section: 'primary',
    icon: [<DnsRoundedIcon key="mui" />, <ProfilesSvg key="svg" />],
    Component: ProfilesPage,
  },

  {
    displayLabel: 'Rules',
    label: 'layout.components.navigation.tabs.rules',
    path: '/rules',
    section: 'secondary',
    icon: [<ForkRightRoundedIcon key="mui" />, <RulesSvg key="svg" />],
    Component: RulesPage,
  },
  {
    displayLabel: 'Connections',
    label: 'layout.components.navigation.tabs.connections',
    path: '/connections',
    section: 'secondary',
    icon: [<LanguageRoundedIcon key="mui" />, <ConnectionsSvg key="svg" />],
    Component: ConnectionsPage,
  },
  {
    displayLabel: 'Logs',
    label: 'layout.components.navigation.tabs.logs',
    path: '/logs',
    section: 'secondary',
    icon: [<SubjectRoundedIcon key="mui" />, <LogsSvg key="svg" />],
    Component: () => null /* KeepAlive: real LogsPage rendered in Layout */,
  },
  {
    displayLabel: 'Settings',
    label: 'layout.components.navigation.tabs.settings',
    path: '/settings',
    section: 'primary',
    icon: [<SettingsRoundedIcon key="mui" />, <SettingsSvg key="svg" />],
    Component: SettingsPage,
  },
  {
    displayLabel: 'Unlock',
    label: 'layout.components.navigation.tabs.unlock',
    path: '/unlock',
    section: 'hidden',
    icon: [<LockOpenRoundedIcon key="mui" />, <UnlockSvg key="svg" />],
    Component: UnlockPage,
  },
]

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: navItems.map(
      (item) =>
        ({
          path: item.path,
          Component: item.Component,
        }) as RouteObject,
    ),
  },
])
