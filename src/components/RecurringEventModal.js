import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import moment from 'moment'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import {Modal, AmountInput, DateSelect, IntervalTypesPicker, SimpleTextInput, DrawerPicker} from '.'
import {parameterizeName} from '../utils'
import {commonStyles, colors, intervalTypes, dateFormat} from '../variables'
import {addRecurringEvent, updateRecurringEvent} from '../actions'

class RecurringEventModal extends Component {
  static propTypes = {
    eventType: PropTypes.string.isRequired,
    eventId: PropTypes.string
  }

  static defaultProps = {}

  constructor (props) {
    super(props)

    this._selectedEvent = props.recurringEvents[props.eventId]

    this.state = this._determineState()

    this._currEventId = props.eventId
    this._isEditing = !!this._selectedEvent

    this._eventIds = Object.keys(props.recurringEvents)
    this._filteredIds = this._eventIds.filter(id => id !== this._currEventId)
  }

  _requiredInputs = ['name', 'amount']

  componentWillReceiveProps(nextProps) {
    if (nextProps.eventId !== this.props.eventId) {
      this._selectedEvent = nextProps.recurringEvents[nextProps.eventId]
      this._isEditing = !!this._selectedEvent

      this._currEventId = nextProps.eventId
      this._eventIds = Object.keys(nextProps.recurringEvents)
      this._filteredIds = this._eventIds.filter(id => id !== this._currEventId)

      this.setState(this._determineState())
    }
  }

  render () {
    return (
      <Modal
        showDone={this._validateInputs()}
        onDone={this._onDone}
        onClose={this.props.onClose}
        modalVisible={this.props.isVisible}
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
    this.props.onClose()
    const action = this._isEditing ? 'updateRecurringEvent' : 'addRecurringEvent'
    this.props[action]({
      ...this.state,
      id: this.props.eventId,
      eventType: this.props.eventType
    })
  }
}

const mapStateToProps = state => ({
  recurringEvents: state.recurringEvents,
  cashAccounts: Object.keys(state.cashAccounts),
})

export default connect(mapStateToProps, {addRecurringEvent, updateRecurringEvent})(RecurringEventModal)
