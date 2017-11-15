import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { View, Text, StyleSheet, Picker, TextInput, Alert } from 'react-native'
import moment from 'moment'
import {Modal, SimpleTextInput, AmountInput} from '.'
import {addCashAccount, updateCashAccount} from '../actions'
import {commonStyles, colors} from '../variables'
import {parameterizeName} from '../utils'

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
      ...this._determineState(props)
    }

    this._requiredInputs = ['name', 'amount', 'comfortableMin']
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
          onChangeText={this._onTextChange.bind(this, 'name')}
          label='Name'
        />
        <AmountInput
          value={this.state.amount}
          onChangeText={this._onTextChange.bind(this, 'amount')}
          label='Balance'
        />
        <AmountInput
          value={this.state.comfortableMin}
          onChangeText={this._onTextChange.bind(this, 'comfortableMin')}
          label='Comfortable Minimum'
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

  _onAlertCancel = () => {
    this.props.updateCashAccount(this._currAccountId, this._currAccount)
  }

  _onDone = () => {
    const currentAlerts = this.props.alerts
    if (this._isEditing) {
      this.props.updateCashAccount(this.props.accountId, this.state).then(nextState => {
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
