import {omit, groupBy, filter, flatten, mapValues} from 'lodash'
import moment from 'moment'
import {dateFormat, recurringEventTypes} from '../variables'

export const formatDateCollection = (date, collection) => {
  if (Array.isArray(collection)) return collection

  const {relDates} = collection
  const col = !relDates ? collection : omit(collection, 'relDates')
  const dates = Object.keys(col).map(d => moment(d, dateFormat).toDate())
  return !relDates ? [date, ...dates] : [date, ...dates, relDates]
}

export const getGeneratedDates = recurringEvents => {
  return mapValues(recurringEvents, e => e.generatedDates)
}

export const groupEventsByDate = recurringEvents => {
  const generatedDates = getGeneratedDates(recurringEvents)
  const flattened = flatten(Object.values(generatedDates))
  return groupBy(flattened, e => e.date.format(dateFormat))
}

export const findEventsByType = (recurringEvents, type) => {
  return filter(recurringEvents, e => e.eventType === type)
}

export const findEventsByDate = (recurringEvents, date = moment()) => {
  const grouped = groupEventsByDate(recurringEvents)
  return grouped[date.format(dateFormat)] || []
}


export const formatAmount = (amount, eventType) => {
  const absAmount = Math.abs(amount)
  return eventType === recurringEventTypes.expense ? absAmount * -1 : absAmount
}

export const calcForecast = ({
  cashAccounts,
  recurringEvents,
  settings: {projection, comfortableMin}
}) => {
  const groupedEvents = groupEventsByDate(recurringEvents)
  const today = moment()
  const daysCount = moment(today).add(projection.count, projection.type).diff(today, 'days')
  let dates = {}
  let alerts = {}
  let runningTotals = mapValues(cashAccounts, a => a.amount)
  let allTotals = []

  for (let i = 0; i < daysCount; i++) {
    const currDay = moment(today).add(i, 'day').format(dateFormat)
    const events = groupedEvents[currDay]

    // takes the current runningTotals and converts the values to an object with the value in amount
    const mapTotalsToDate = () => ({
      ...dates,
      [currDay]: mapValues(runningTotals, t => ({amount: t}))
    })

    if (!events) {
      dates = mapTotalsToDate()
      continue
    }

    events.forEach((e, i, arr) => {
      const {account} = recurringEvents[e.id]
      const newAmount = runningTotals[account] + e.amount

      runningTotals = {
        ...runningTotals,
        [account]: newAmount
      }
      allTotals.push(newAmount)

      if (newAmount >= comfortableMin) {
        dates = mapTotalsToDate()
        return
      }

      const alert = {
        message: newAmount >= 0 ? 'Account balance is below the comfort level' : 'Account balance is overdrawn',
        ids: arr.map(v => v.id),
        account,
      }

      dates = {
        ...dates,
        [currDay]: {
          ...dates[currDay],
          [account]: {
            amount: newAmount,
            alert
          }
        }
      }

      alerts = {
        ...alerts,
        [currDay]: alert
      }
    })
  }

  return {
    dates,
    alerts
  }
}
