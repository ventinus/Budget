import React, {Component} from 'react';
import {AsyncStorage, NetInfo, Platform, StatusBar} from 'react-native'
import {Provider} from 'react-redux'
import {persistStore} from 'redux-persist';
import store from './store/configureStore'
import {setIsConnected, updateForecast} from './actions'
import Navigator from './Navigator'

import {recurringEventsSeed} from '../seeds'

const persistConfig = { storage: AsyncStorage, whitelist: [] }

class App extends Component {
  state = {rehydrated: false}

  constructor() {
    super()
    StatusBar.setBarStyle('light-content')
  }

  componentWillMount () {
    persistStore(store, persistConfig, () => { this.setState({rehydrated: true}) })
  }

  componentDidMount () {
    NetInfo.isConnected.fetch().then().done(() => {
      NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange)
    })

    this._seedData()
  }

  componentWillUnmount () {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange)
  }

  render() {
    return (
      <Provider store={store} >
        <Navigator />
      </Provider>
    )
  }

  _handleConnectivityChange = (isConnected) => store.dispatch(setIsConnected(isConnected))

  _seedData = () => {
    const {settings: {projection}} = store.getState()
    new Promise((resolve, reject) => {
      Object.values(recurringEventsSeed).forEach(e => {
        store.dispatch({
          ...e,
          projection,
          type: 'ADD_RECURRING_EVENT',
        })
      })
      return resolve()
    }).then(() => store.dispatch(updateForecast(store.getState())))
  }
}

export default App
