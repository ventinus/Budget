import { TabNavigator } from 'react-navigation'
import {
  Home,
  Accounts
} from './containers'

const routes =  {
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home'
    }
  },
  Accounts: {
    screen: Accounts,
    navigationOptions: {
      tabBarLabel: 'Accounts'
    }
  }
}

const Navigator = TabNavigator(routes, {
  tabBarOptions: {
    activeTintColor: '#f00'
  }
})

export default Navigator
