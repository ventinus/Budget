import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { View, Text, StyleSheet, Picker, TextInput } from 'react-native'
import {Modal, SimpleTextInput, AmountInput, NotificationModal} from '.'
import {addCashAccount, updateCashAccount} from '../actions'
import {commonStyles, colors} from '../variables'
import {parameterizeName} from '../utils'

const PLACEHOLDERS = {
  name: 'Enter Account Name',
  amount: 'Account Balance',
  comfortableMin: 'Comforable Minimum'
}

const DEFAULT_STATE = {
  name: '',
  amount: '',
  comfortableMin: ''
}

class CashAccountModal extends Component {
  static propTypes = {
    accountId: PropTypes.string,
    isVisible: PropTypes.bool
  }

  static defaultProps = {
    accountId: '',
    isVisible: false
  }

  constructor(props) {
    super(props);

    this._setValues(props)

    this.state = {
      ...this._determineState(props),
      notificationIsVisible: false,
      notificationIssue: {}
    }

    this._requiredInputs = ['name', 'amount']
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.props.isVisible) {

      this._setValues(nextProps)

      // const nextState = this._isEditing ? nextProps.cashAccounts[nextProps.accountId] : DEFAULT_STATE
      this.setState({
        ...this.state,
        ...this._determineState(nextProps)
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
      >
        <SimpleTextInput
          value={this.state.name}
          onFocus={this._onTextFocus.bind(this, 'name')}
          onChangeText={this._onTextChange.bind(this, 'name')}
          placeholder={PLACEHOLDERS.name}
        />
        <AmountInput
          value={this.state.amount}
          onFocus={this._onTextFocus.bind(this, 'amount')}
          onChangeText={this._onTextChange.bind(this, 'amount')}
          options={{placeholder: PLACEHOLDERS.amount}}
        />
        <AmountInput
          value={this.state.comfortableMin}
          onFocus={this._onTextFocus.bind(this, 'comfortableMin')}
          onChangeText={this._onTextChange.bind(this, 'comfortableMin')}
          options={{placeholder: PLACEHOLDERS.comfortableMin}}
        />
        <NotificationModal
          isVisible={this.state.notificationIsVisible}
          onConfirm={this._onNotificationConfirm}
          onCancel={this._onNotificationCancel}
          issue={this.state.notificationIssue}
        />
      </Modal>
    )
  }

  _determineState = (props) => {
    return this._isEditing ? props.cashAccounts[props.accountId] : DEFAULT_STATE
  }

  _setValues = (props) => {
    this._currAccountId = props.accountId
    this._currAccount = props.cashAccounts[this._currAccountId]
    this._isEditing = this._currAccountId.length > 0
    this._cashIds = Object.keys(props.cashAccounts)
    this._filteredIds = this._cashIds.filter(id => id !== this._currAccountId)
  }

  _onTextFocus = (category) => {
    if (this.state[category] === PLACEHOLDERS[category]) {
      this.setState({[category]: ''})
    }
  }

  _onTextChange = (category, text) => this.setState({[category]: text})

  _validateInputs = () => {
    let validInputs = true
    this._requiredInputs.forEach(v => {
      if (this.state[v].length === 0) {
        validInputs = false
      }
    })

    const paramName = parameterizeName(this.state.name)

    if (this._isEditing) {
      if (paramName !== this._currAccountId && this._filteredIds.includes(paramName)) {
        validInputs = false
      }
    } else if (this._cashIds.includes(paramName)) {
      validInputs = false
    }

    return validInputs
  }

  _onNotificationConfirm = () => {
    this.setState({notificationIsVisible: false})

    setTimeout(() => {
      this.props.onClose()
    }, 1)
  }

  _onNotificationCancel = () => {
    this.setState({notificationIsVisible: false})

    this.props.updateCashAccount(this._currAccountId, this._currAccount)
  }

  _onDone = () => {
    const currentAlerts = this.props.alerts
    if (this._isEditing) {
      this.props.updateCashAccount(this.props.accountId, this.state).then(nextState => {
        const {forecast: {alerts}, recurringEvents} = nextState
        const alertKeys = Object.keys(alerts)
        const currentAlertKeys = Object.keys(currentAlerts)
        const diffAlert = alertKeys.find((val, i) => val !== currentAlertKeys[i])

        if (!diffAlert) {
          this.props.onClose()
        } else {
          this.setState({
            notificationIsVisible: true,
            notificationIssue: {[diffAlert]: alerts[diffAlert]}
          })
        }
      })
    } else {
      this.props.onClose()
      this.props.addCashAccount(this.state)
    }
  }
}

const mapStateToProps = state => ({
  cashAccounts: state.cashAccounts,
  alerts: state.forecast.alerts
})

export default connect(mapStateToProps, {addCashAccount, updateCashAccount})(CashAccountModal)
