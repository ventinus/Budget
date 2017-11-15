import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import moment from 'moment'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import {Modal, AmountInput, DateSelect, IntervalTypesPicker, SimpleTextInput, DrawerPicker} from '.'
import {parameterizeName} from '../utils'
import {commonStyles, colors, intervalTypes, dateFormat} from '../variables'
import {addRecurringEvent, removeRecurringEvent, updateRecurringEvent} from '../actions'

class RecurringEventModal extends Component {
  static propTypes = {
    eventType: PropTypes.string.isRequired,
    eventId: PropTypes.string
  }

  static defaultProps = {}

  constructor (props) {
    super(props)

    this.state = {
      ...this._determineState()
    }

    this._setValues(props)
  }

  _requiredInputs = ['name', 'amount']

  componentWillReceiveProps(nextProps) {
    if (!this.props.isVisible && nextProps.isVisible) {
      this._setValues(nextProps)

      this.setState({
        ...this.state,
        ...this._determineState()
      })
    }
  }

  render () {
    return (
      <Modal
        showDone={this._validateInputs()}
        onDone={this._onDone}
        onClose={this.props.onClose}
        modalVisible={this.props.isVisible}
        name='recurring'
      >
        <ScrollView>
          <SimpleTextInput
            value={this.state.name}
            onChangeText={this._onTextChange.bind(this, 'name')}
            placeholder='Enter Name'
          />
          <AmountInput
            value={this.state.amount}
            onChangeText={this._onTextChange.bind(this, 'amount')}
            options={{placeholder: '0.00'}}
          />
          <DrawerPicker
            selectedValue={this.state.account}
            onValueChange={this._onAccountChange}
            pickerItems={this.props.cashAccounts}
            label='Select Account:'
          />
          <DateSelect
            date={this.state.date}
            onChange={date => this.setState({date})}
          />
          <IntervalTypesPicker
            selectedInterval={this.state.interval}
            onIntervalChange={this._onIntervalChange}
            date={moment(this.state.date).format(dateFormat)}
            onDayChange={dates => {this.state.dateCollection = dates}}
            dateCollection={this.state.dateCollection}
          />
          <DateSelect
            date={this.state.expires}
            label='Expires at:'
            onChange={date => this.setState({date: expires})}
          />
          <SimpleTextInput
            value={this.state.note}
            onChangeText={this._onTextChange.bind(this, 'note')}
            placeholder='Enter Note'
          />
        </ScrollView>
      </Modal>
    )
  }

  _eventOrDefault = (eventProp, defaultVal = '') => ({
    [eventProp]: !this._selectedEvent ? defaultVal : this._selectedEvent[eventProp]
  })

  _determineState = () => {
    return Object.assign({},
      this._eventOrDefault('name'),
      this._eventOrDefault('amount'),
      this._eventOrDefault('account', this.props.cashAccounts[0]),
      this._eventOrDefault('date', new Date()),
      this._eventOrDefault('expires', moment().add(1, 'year').toDate()),
      this._eventOrDefault('note'),
      this._eventOrDefault('dateCollection', []),
      {
        interval: !this._selectedEvent
          ? {
            type: intervalTypes.month,
            frequency: 1
          }
          : {
            type: this._selectedEvent.interval,
            frequency: this._selectedEvent.frequency
          }
      }
    )
  }

  _setValues = props => {
    this._currEventId = props.eventId
    this._selectedEvent = props.recurringEvents[this._currEventId]
    this._isEditing = !!this._selectedEvent

    this._eventIds = Object.keys(props.recurringEvents)
    this._filteredIds = this._eventIds.filter(id => id !== this._currEventId)
  }

  _onTextChange = (category, text) => this.setState({[category]: text})

  _onAccountChange = account => this.setState({account})

  _onIntervalChange = interval => this.setState({interval})

  _validateInputs = () => {
    let validInputs = this._requiredInputs.reduce((a, c) => !a ? a : this.state[c].toString().length > 0, true)

    const paramName = parameterizeName(this.state.name)

    if (this._isEditing) {
      if (paramName !== this._currEventId && this._filteredIds.includes(paramName)) {
        validInputs = false
      }
    } else if (this._eventIds.includes(paramName)) {
      validInputs = false
    }

    return validInputs
  }

  _onDone = () => {
    const currentAlerts = this.props.alerts
    const action = this._isEditing ? 'updateRecurringEvent' : 'addRecurringEvent'

    this.props[action]({
      ...this.state,
      id: this.props.eventId,
      eventType: this.props.eventType
    }).then(nextState => {
      const {forecast: {alerts}, recurringEvents, cashAccounts} = nextState
      const alertKeys = Object.keys(alerts)
      const currentAlertKeys = currentAlerts ? Object.keys(currentAlerts) : []
      const diffAlert = alertKeys.find((val, i) => val !== currentAlertKeys[i])

      if (!diffAlert) {
        this.props.onClose()
      } else {
        const {account, message, ids} = alerts[diffAlert]

        Alert.alert(
          'Are you sure?',
          `${cashAccounts[account].name} ${message} because of: ${ids.map(id => recurringEvents[id].name).join(', ')}\nFirst Date: ${moment(diffAlert, 'YYYY-MM-DD').format('MMM D, YYYY')}`,
          [
            {text: 'Cancel', onPress: this._onAlertCancel},
            {text: 'Ok', onPress: this.props.onClose}
          ]
        )
      }

    })
  }

  _onAlertCancel = () => {
    // undo changed state
    if (this._isEditing) {
      this.props.updateRecurringEvent({
        ...this._selectedEvent,
        id: this.props.eventId,
        interval: {
          type: this._selectedEvent.interval,
          frequency: this._selectedEvent.frequency
        }
      })
    } else {
      this.props.removeRecurringEvent(parameterizeName(this.state.name))
    }
  }
}

const mapStateToProps = state => ({
  recurringEvents: state.recurringEvents,
  cashAccounts: Object.keys(state.cashAccounts),
  alerts: state.forecast.alerts
})

export default connect(mapStateToProps, {addRecurringEvent, removeRecurringEvent, updateRecurringEvent})(RecurringEventModal)
