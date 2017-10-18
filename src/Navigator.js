import React from 'react'
import { TabNavigator } from 'react-navigation'
import {HomeIcon, AccountIcon, CalendarIcon, SettingsIcon} from './components'

import {
  Home,
  Accounts,
  CalendarScene,
  Settings
} from './containers'


const routes =  {
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: <HomeIcon />
    }
  },
  Accounts: {
    screen: Accounts,
    navigationOptions: {
      tabBarLabel: 'Accounts',
      tabBarIcon: <AccountIcon />
    }
  },
  Calendar: {
    screen: CalendarScene,
    navigationOptions: {
      tabBarLabel: 'Calendar',
      tabBarIcon: <CalendarIcon />
    }
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: <SettingsIcon />
    }
  }
}

const Navigator = TabNavigator(routes, {
  tabBarOptions: {
    activeTintColor: '#f00'
  }
})

export default Navigator
