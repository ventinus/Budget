import {SET_FORECAST} from '../actions/actionTypes'

const forecastReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_FORECAST:
      return action.forecast
    default:
      return state
  }
}

export default forecastReducer
