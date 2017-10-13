// @flow
import {createStore, applyMiddleware, compose} from 'redux'
import {autoRehydrate} from 'redux-persist';
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import rootReducer from '../reducers'

export default function configureStore (initialState: any = undefined) {
  const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent
  const logger = createLogger({
    predicate: (getState, action) => isDebuggingInChrome,
    collapsed: true,
    duration: true
  })

  const enhancer = compose(
    applyMiddleware(thunk, logger),
    autoRehydrate()
  )

  return createStore(rootReducer, initialState, enhancer)
}
