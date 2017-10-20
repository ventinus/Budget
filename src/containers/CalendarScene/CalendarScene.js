// @flow
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ScreenHOC from '../ScreenHOC'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import {mapValues} from 'lodash'
import moment from 'moment'
import {CalendarList} from 'react-native-calendars'
import {groupEventsByDate} from '../../utils'
import {layoutStyles, colors, dateFormat} from '../../variables'
import styles from './styles.js'

export default class CalendarScene extends Component {
  static propTypes = {}
  static defaultProps = {}

  constructor (props) {
    super(props)

    this._formattedEvents = this._formatEvents(props)
    this._customStyles = StyleSheet.flatten([styles.day, styles.eventIndicator])
  }

  componentWillReceiveProps(nextProps) {
    this._formattedEvents = this._formatEvents(nextProps)
  }

  render () {
    return (
      <ScreenHOC style={layoutStyles}>
        <CalendarList
          onDayPress={this._onDayPress}
          markedDates={this._formattedEvents}
          markingType={'interactive'}
        />
      </ScreenHOC>
    )
  }

  _formatEvents = ({groupedRecurringEvents}) => {
    return mapValues(groupedRecurringEvents, d => {
      const dayTotal = d.reduce((a, c) => { return a + c.amount }, 0)
      return [{
        color: dayTotal < 0 ? colors.red : colors.green,
        textColor: colors.white
      }]
    })
  }

  _onDayPress = day => {
    const eventData = this._formattedEvents[day.dateString]

    if (eventData) {
      this.props.navigation.navigate('DayBreakdown', {date: day.dateString})
    }
  }
}
