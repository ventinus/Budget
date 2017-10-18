import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { View, Text, StyleSheet, Picker, TextInput } from 'react-native'
import {Modal, SimpleTextInput, AmountInput} from '.'
import {addCashAccount, updateCashAccount} from '../actions'
import {commonStyles, colors} from '../variables'
import {parameterizeName} from '../utils'

const PLACEHOLDERS = {
  name: 'Enter Account Name',
  amount: '0.00'
}

const DEFAULT_STATE = {
  name: '',
  amount: ''
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

    this._isEditing = props.accountId.length > 0
    this._currAccountId = props.accountId
    this.state = this._isEditing ? props.cashAccounts[props.accountId] : DEFAULT_STATE

    this._requiredInputs = ['name', 'amount']

    this._cashIds = Object.keys(props.cashAccounts)
    this._filteredIds = this._cashIds.filter(id => id !== this._currAccountId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId !== this.props.accountId) {
      this._isEditing = nextProps.accountId.length > 0

      this._currAccountId = nextProps.accountId

      const nextState = this._isEditing ? nextProps.cashAccounts[nextProps.accountId] : DEFAULT_STATE
      this.setState(nextState)
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
      </Modal>
    )
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

  _onDone = () => {
    this.props.onClose()
    if (this._isEditing) {
      this.props.updateCashAccount(this.props.accountId, this.state)
    } else {
      this.props.addCashAccount(this.state)
    }
  }
}

const mapStateToProps = state => ({
  cashAccounts: state.cashAccounts
})

export default connect(mapStateToProps, {addCashAccount, updateCashAccount})(CashAccountModal)
