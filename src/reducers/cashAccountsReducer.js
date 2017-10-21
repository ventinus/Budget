import {omit} from 'lodash'
import {ADD_CASH_ACCOUNT, REMOVE_CASH_ACCOUNT, UPDATE_CASH_ACCOUNT} from '../actions/actionTypes'
import {cashAccountsSeed} from '../../seeds'

// track transactions to know how much and when deposit. maybe not necessary

const createCashAccount = props => ({
  name: props.name,
  amount: props.amount,
  comfortableMin: props.comfortableMin
})

const cashAccounts = (state = cashAccountsSeed, action) => {
  switch (action.type) {
    case ADD_CASH_ACCOUNT:
      return {
        ...state,
        [action.id]: createCashAccount(action)
      }
    case REMOVE_CASH_ACCOUNT:
      return omit(state, action.id)
    case UPDATE_CASH_ACCOUNT:
      return {
        ...omit(state, action.id),
        [action.updates.id]: createCashAccount(action.updates)
      }
    default:
      return state
  }
}

export default cashAccounts
