import {SET_IS_CONNECTED} from '../actions/actionTypes'

const DEFAULT_STATE = null

const isConnected = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_IS_CONNECTED:
      return action.isConnected
    default:
      return state
  }
}

export default isConnected
