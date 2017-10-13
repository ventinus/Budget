import {UPDATE_FORECAST} from '../actions/actionTypes'

const forecastReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_FORECAST:
      return action.forecast
    default:
      return state
  }
}

export default forecastReducer
