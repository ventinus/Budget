import {UPDATE_SETTINGS} from '../actions/actionTypes'

const DEFAULT_STATE = {
  currency: 'USD',
  projection: {
    type: 'month',
    count: 6
  }
}

const settings = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      return {
        ...state,
        ...action.updates
      }
    default:
      return state
  }
}

export default settings
