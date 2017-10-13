import {omit} from 'lodash'
import {recurringEventTypes} from '../variables'
import {ADD_RECURRING_EVENT, REMOVE_RECURRING_EVENT, UPDATE_RECURRING_EVENT} from '../actions/actionTypes'
import {expandEvent} from '../utils'

const createRecurringEvent = props => ({
  name: props.name,
  eventType: props.eventType,
  amount: props.amount,
  account: props.account,
  date: props.date,
  dateCollection: props.dateCollection,
  interval: props.interval,
  frequency: props.frequency,
  expires: props.expires,
  note: props.note,
  generatedDates: expandEvent(props)
})

const recurringEvents = (state = {}, action) => {
  switch (action.type) {
    case ADD_RECURRING_EVENT:
      return {
        ...state,
        [action.id]: createRecurringEvent(action)
      }
    case REMOVE_RECURRING_EVENT:
      return omit(state, action.id)
    case UPDATE_RECURRING_EVENT:
      // console.log(action.updates)
      // debugger
      return {
        ...omit(state, action.id),
        [action.updates.id]: createRecurringEvent(action.updates)
      }
    default:
      return state
  }
}

export default recurringEvents
