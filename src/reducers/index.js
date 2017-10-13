// @flow weak
// This is the root reducer and root selectors
import {combineReducers} from 'redux'
import isConnected from './isConnectedReducer'
import budgets from './budgetsReducer'
import cashAccounts from './cashAccountsReducer'
import recurringEvents from './recurringEventsReducer'
import forecast from './forecastReducer'
import settings from './settingsReducer'

export default combineReducers({
  isConnected,
  budgets,
  cashAccounts,
  recurringEvents,
  forecast,
  settings
})
