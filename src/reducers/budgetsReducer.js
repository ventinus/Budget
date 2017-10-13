import {omit} from 'lodash'
import {ADD_BUDGET, REMOVE_BUDGET} from '../actions/actionTypes'

const budgets = (state = {}, action) => {
  switch (action.type) {
    case ADD_BUDGET:
      return {
        ...state,
        [action.id]: {
          name: action.name,
          savingsGoal: action.savingsGoal,
          interval: action.interval
        }
      }
    case REMOVE_BUDGET:
      return omit(state, [action.id])
    default:
      return state
  }
}

export default budgets
