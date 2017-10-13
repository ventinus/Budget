import moment from 'moment'
import {daysOfWeek, ordinals} from '../variables'

const isDayOfWeek = num => {
  return (date) => {
    return moment(date).isoWeekday() === num
  }
}

const days = daysOfWeek.reduce((acc, cur, index) => {
  return {
    ...acc,
    [cur]: isDayOfWeek(index + 1)
  }
}, {})

export const firstDayOfMonth = date => moment(date).date(1)

export const lastDayOfMonth = date => moment(date).add(1, 'month').date(1).subtract(1, 'day')

export const isWeekday = date => moment(date).isoWeekday() < 6

export const isWeekendDay = date => moment(date).isoWeekday() > 5

export const isWeekdayType = type => {
  return days[type.toLowerCase()]
}

const recursiveMinus = (date, checker) => {
  if (checker(date)) return date
  return recursiveMinus(date.subtract(1, 'day'), checker)
}

const bindCount = count => {
  let counter = 0
  const max = ordinals.indexOf(count) + 1
  const recursiveAdd = (date, checker) => {
    if (!checker || checker(date)) {
      counter += 1
      if (counter >= max) return date
    }
    return recursiveAdd(date.add(1, 'day'), checker)
  }
  return recursiveAdd
}

export const mapOnTheDayToDate = {
  'amount-weekday': (date, count) => bindCount(count)(firstDayOfMonth(date), isWeekday),
  'amount-weekendDay': (date, count) => bindCount(count)(firstDayOfMonth(date), isWeekendDay),
  'amount-day': (date, count) => bindCount(count)(firstDayOfMonth(date)),
  'amount-weekdayType': (date, day, count) => bindCount(count)(firstDayOfMonth(date), isWeekdayType(day)),
  'last-weekday': date => recursiveMinus(lastDayOfMonth(date), isWeekday),
  'last-weekendDay': date => recursiveMinus(lastDayOfMonth(date), isWeekendDay),
  'last-day': lastDayOfMonth,
  'last-weekdayType': (date, day) => recursiveMinus(lastDayOfMonth(date), isWeekdayType(day))
}
