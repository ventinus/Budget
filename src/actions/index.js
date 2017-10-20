import {filter} from 'lodash'
import * as actionTypes from './actionTypes'
import {parameterizeName, zeroOutTime, formatDateCollection, calcForecast, formatAmount} from '../utils'

export const setIsConnected = (isConnected) => ({
  isConnected,
  type: actionTypes.SET_IS_CONNECTED
})

export const updateForecast = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.UPDATE_FORECAST,
    forecast: calcForecast(getState())
  })
}

// Budget Action Creators
// ___________________________________________
export const addBudget = ({name, savingsGoal, interval}) => ({
  name,
  savingsGoal,
  interval,
  type: actionTypes.ADD_BUDGET,
  id: parameterizeName(name)
})

export const removeBudget = id => ({
  id,
  type: actionTypes.REMOVE_BUDGET,
})


const dispatchAndUpdateForecast = actionCreator => props => dispatch => {
  return dispatch(actionCreator(props)).then(() => {
    return dispatch(updateForecast())
  })
}

// CashAccount Action Creators
// ___________________________________________

const processCashAccountProps = props => ({
  id: parameterizeName(props.name),
  amount: +props.amount,
  name: props.name
})

export const addCashAccount = props => ({
  ...processCashAccountProps(props),
  type: actionTypes.ADD_CASH_ACCOUNT
})

export const removeCashAccount = id => ({
  id,
  type: actionTypes.REMOVE_CASH_ACCOUNT
})

const updateCash = (id, updates) => dispatch => {
  dispatch({
    id,
    type: actionTypes.UPDATE_CASH_ACCOUNT,
    updates: processCashAccountProps(updates)
  })
  return Promise.resolve()
}

// when a cash account is updated, all of the corresponding events assiciated with it
// need updating as well. mostly just the id reference. which then also needs
// to have the forecast recalculated with the updated account amount
export const updateCashAccount = (id, updates) => (dispatch, getState) => {
  return dispatch(updateCash(id, updates)).then(() => {
    const {recurringEvents} = getState()
    const effectedEvents = filter(recurringEvents, e => e.account === id)

    effectedEvents.forEach(e => {
      const eventUpdates = {
        ...e,
        id: parameterizeName(e.name),
        account: parameterizeName(updates.name)
      }

      return dispatch(updateRecurring(eventUpdates, true))
    })

    return dispatch(updateForecast())
  })
}

// Recurring Event Action Creators
// ___________________________________________

const processRecurringProps = props => ({
  account: props.account,
  amount: formatAmount(props.amount, props.eventType),
  date: zeroOutTime(props.date),
  dateCollection: formatDateCollection(props.date, props.dateCollection),
  expires: zeroOutTime(props.expires),
  eventType: props.eventType,
  frequency: parseInt(props.interval.frequency),
  id: parameterizeName(props.name),
  interval: props.interval.type,
  name: props.name,
  note: props.note
})

const addRecurring = props => (dispatch, getState) => {
  dispatch({
    ...processRecurringProps(props),
    type: actionTypes.ADD_RECURRING_EVENT,
    projection: getState().settings.projection
  })
  return Promise.resolve()
}

const removeRecurring = id => (dispatch, getState) => {
  dispatch({
    id,
    type: actionTypes.REMOVE_RECURRING_EVENT,
    projection: getState().settings.projection
  })
  return Promise.resolve()
}

const updateRecurring = (updates, skipProcessing = false) => (dispatch, getState) => {
  const whichUpdates = skipProcessing ? updates : processRecurringProps(updates)
  dispatch({
    id: updates.id,
    updates: {
      ...whichUpdates,
      projection: getState().settings.projection
    },
    type: actionTypes.UPDATE_RECURRING_EVENT,
  })
  return Promise.resolve()
}

export const addRecurringEvent = dispatchAndUpdateForecast(addRecurring)
export const removeRecurringEvent = dispatchAndUpdateForecast(removeRecurring)
export const updateRecurringEvent = dispatchAndUpdateForecast(updateRecurring)
