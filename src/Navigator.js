import React from 'react'
import { StackNavigator, TabNavigator } from 'react-navigation'
import {HomeIcon, AccountIcon, CalendarIcon, SettingsIcon, StackHeader} from './components'

import {
  Home,
  Accounts,
  CalendarScene,
  Settings,
  DayBreakdown
} from './containers'

const tabRoutes =  {
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

const MainNavigator = TabNavigator(tabRoutes, {
  tabBarOptions: {
    activeTintColor: '#f00'
  }
})

const Navigator = StackNavigator({
  Home: {
    screen: MainNavigator,
    navigationOptions: {
      header: null
    }
  },
  DayBreakdown: {
    screen: DayBreakdown,
    navigationOptions: {
      header(a, b, c) {
        return (<StackHeader title='Day Breakdown' {...a} />)
      }
    }
  }
}, {
  mode: 'modal',
  transitionConfig: () => ({
     transitionSpec: {
       duration: 150
     }
   })
})

export default Navigator
