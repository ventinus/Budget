import moment from 'moment'
import {parameterizeName, mapOnTheDayToDate, uniqDays} from '../utils'
import {intervalTypes, daysOfWeek} from '../variables'

const convertRelativeOccurrenceToDate = (occurrenceString, dateInMonth) => {
  const [count, type] = occurrenceString.split('-')
  const isOfWeekdayType = daysOfWeek.indexOf(type) >= 0

  if (count === 'last') {
    if (isOfWeekdayType) {
      return mapOnTheDayToDate[`last-weekdayType`](dateInMonth, type)
    } else {
      return mapOnTheDayToDate[occurrenceString](dateInMonth)
    }
  } else {
    if (isOfWeekdayType) {
      return mapOnTheDayToDate[`amount-weekdayType`](dateInMonth, type, count)
    } else {
      return mapOnTheDayToDate[`amount-${type}`](dateInMonth, count)
    }
  }
}

// used to repeat an event on a daily, weekly, or yearly basis
const easyRepeat = (timeType) => {
  return (event, finalDay) => {
    const {date, frequency, dateCollection} = event
    const originalDate = moment(date)
    const timesCount = finalDay.diff(originalDate, timeType)
    let allOccurrences = []

    for (let i = 0; i <= timesCount; i += frequency) {
      const occurrences = dateCollection
        .map(d => {
          if (typeof d !== 'string') {
            return moment(d).add(i, timeType)
          }
          return null
        })
        .filter(d => d)
        .reduce(uniqDays, [])

      allOccurrences = allOccurrences.concat(occurrences)
    }

    return allOccurrences
  }
}

// repeats an event on a monthly basis. takes into account more complex
// repeat/interval options
const repeatMonthly = (event, finalDay) => {
  const {date, frequency, dateCollection} = event
  const originalDate = moment(date)
  const monthsCount = finalDay.diff(originalDate, 'months') + 1
  let allOccurrences = []

  for (let i = 0; i <= monthsCount; i += frequency) {
    const currMonth = moment(originalDate).add(i, 'month')
    const monthsOccurrences = dateCollection.map(d => {
      if (typeof d === 'string') {
        return convertRelativeOccurrenceToDate(d, currMonth)
      } else {
        return moment(d).add(i, 'month')
      }
    })

    const uniqOccurrences = monthsOccurrences.reduce(uniqDays, [])

    allOccurrences = allOccurrences.concat(uniqOccurrences)
  }

  return allOccurrences
}

// maps the repeater functions to their interval types
const intervalExpanders = {
  [intervalTypes.day]: easyRepeat('days'),
  [intervalTypes.week]: easyRepeat('weeks'),
  [intervalTypes.month]: repeatMonthly,
  [intervalTypes.year]: easyRepeat('years')
}


const expandEvent = event => {
  const finalProjectionDay = moment(new Date()).add(event.projection.count, event.projection.type)
  const expiresDay = moment(event.expires)
  const finalDay = expiresDay.isBefore(finalProjectionDay) ? expiresDay : finalProjectionDay
  const allUniqueDates = intervalExpanders[event.interval](event, finalDay)

  return allUniqueDates.filter(d => d.isBefore(finalDay))
    .map(date => ({
      date,
      amount: event.amount,
      id: parameterizeName(event.name)
    }))
}

export default expandEvent
