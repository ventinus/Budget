import React, {Component} from 'react'
import ScreenHOC from '../ScreenHOC'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native'
import {AccountGroup, CashAccountModal, RecurringEventModal} from '../../components'
import {layoutStyles, commonStyles, colors, recurringEventTypes} from '../../variables'
import {parameterizeName} from '../../utils'

import styles from './styles.js'

class Accounts extends Component {
  state = {
    cashModalVisible: false,
    cashAccountId: '',
    recurringModalVisible: false,
    recurringEventId: '',
    recurringEventType: '',
    isEditing: false
  }

  constructor(props) {
    super(props)

    this._occupiedCashAccounts = this._getRemovableCashAccounts(props)
    this._hasCashAccounts = props.cashAccounts.length > 0
  }

  componentWillReceiveProps(nextProps) {
    this._occupiedCashAccounts = this._getRemovableCashAccounts(nextProps)
    this._hasCashAccounts = nextProps.cashAccounts.length > 0
  }

  render() {
    const {budgets, cashAccounts, incomeEvents, expenseEvents} = this.props

    return (
      <ScreenHOC
        header={(
          <View style={[commonStyles.splitBetween, styles.header]}>
            <View style={{flex: 1}}>
              <TouchableOpacity style={styles.editBtn} onPress={this._toggleEditMode}>
                <Text style={styles.editBtnText}>{this.state.isEditing ? 'Done' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={{textAlign: 'center', flex: 1}}>Accounts</Text>
            <View style={{flex: 1}}></View>
          </View>
        )}
      >
        <ScrollView style={[styles.container]}>

          <AccountGroup
            name='Cash Accounts'
            data={cashAccounts}
            themeColor={colors.green}
            onAddPress={this._revealNew('cashAccountId', 'cashModalVisible')}
            onAccountPress={this._setCashAccountId}
            isEditing={this.state.isEditing}
            onDeletePress={this._removeCash}
          />

          <AccountGroup
            name='Income Sources'
            data={incomeEvents}
            themeColor={colors.stone}
            onAddPress={this._hasCashAccounts ? this._revealNew('recurringEventId', 'recurringModalVisible', 'recurringEventType', recurringEventTypes.deposit) : null}
            onAccountPress={this._setRecurringEvent}
            isEditing={this.state.isEditing}
            onDeletePress={this.props.removeRecurringEvent}
          />

          <AccountGroup
            name='Recurring Expenses'
            data={expenseEvents}
            themeColor={colors.autumn}
            onAddPress={this._hasCashAccounts ? this._revealNew('recurringEventId', 'recurringModalVisible', 'recurringEventType', recurringEventTypes.expense) : null}
            onAccountPress={this._setRecurringEvent}
            isEditing={this.state.isEditing}
            onDeletePress={this.props.removeRecurringEvent}
          />

          <CashAccountModal
            isVisible={this.state.cashModalVisible}
            onClose={this._setModalVisibility('cash', false)}
            accountId={this.state.cashAccountId}
          />

          <RecurringEventModal
            isVisible={this.state.recurringModalVisible}
            onClose={this._setModalVisibility('recurring', false)}
            eventId={this.state.recurringEventId}
            eventType={this.state.recurringEventType}
          />

        </ScrollView>
      </ScreenHOC>
    )
  }

  _setModalVisibility = (name, isVisible) => () => this.setState({[`${name}ModalVisible`]: isVisible})

  _revealNew = (type, modalKey, eventTypeKey, eventTypeVal) => () => {
    this.setState({
      [type]: '',
      [modalKey]: true,
      [eventTypeKey]: eventTypeVal,
      isEditing: false
    })
  }

  _setCashAccountId = accountId => {
    this.setState({
      cashAccountId: accountId,
      cashModalVisible: true,
      isEditing: false
    })
  }

  _setRecurringEvent = (eventId, eventType) => {
    this.setState({
      recurringModalVisible: true,
      recurringEventId: eventId,
      recurringEventType: eventType,
      isEditing: false
    })
  }

  _toggleEditMode = () => {
    this.setState({isEditing: !this.state.isEditing})
  }

  _getRemovableCashAccounts = props => {
    return Object.values({...props.incomeEvents, ...props.expenseEvents}).reduce((a, {account}) => {
      return a.includes(account) ? a : [...a, account]
    }, [])
  }

  _removeCash = (cashAccountId) => {
    if (this._occupiedCashAccounts.includes(cashAccountId)) {
      Alert.alert(
        'Warning:\nThis account is being used by recurring events.',
        'Failure to remove/update those events before confirming will result in their removal',
        [
          {text: 'Cancel', onPress: () => {}},
          {text: 'Ok', onPress: () => this._confirmCashRemoval(cashAccountId)}
        ]
      )
    } else {
      this.props.removeCashAccount(cashAccountId)
    }
  }

  _confirmCashRemoval = cashAccountId => {
    this.props.removeCashAccount(cashAccountId)
    // console.log(this.props)
    const eventIds = [...this.props.incomeEvents, ...this.props.expenseEvents]
      .filter(e => e.account === cashAccountId).map(e => parameterizeName(e.name))
    eventIds.forEach(this.props.removeRecurringEvent)
    //   console.log(a, c, k)
    //   debugger
    // })
  }
}

export default Accounts
