import React, {Component} from 'react'
import ScreenHOC from '../ScreenHOC'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import {AccountGroup, CashAccountModal, RecurringEventModal} from '../../components'
import {layoutStyles, commonStyles, colors, recurringEventTypes} from '../../variables'

import styles from './styles.js'

class Accounts extends Component {
  state = {
    cashModalVisible: false,
    cashAccountId: '',
    recurringModalVisible: false,
    recurringEventId: '',
    recurringEventType: ''
  }

  render() {
    const {budgets, cashAccounts, incomeEvents, expenseEvents} = this.props
    return (
      <ScreenHOC style={layoutStyles}>
        <ScrollView style={[styles.container]}>

          <AccountGroup
            name='Cash Accounts'
            data={cashAccounts}
            themeColor={colors.green}
            onAddPress={this._revealNew('cashAccountId', 'cashModalVisible')}
            onAccountPress={this._setCashAccountId}
          />

          <AccountGroup
            name='Income Sources'
            data={incomeEvents}
            themeColor={colors.stone}
            onAddPress={this._revealNew('recurringEventId', 'recurringModalVisible', recurringEventTypes.deposit)}
            onAccountPress={this._setRecurringEvent}
            // onAddPress={() => {Actions.recurringEventModal({eventType: recurringEventTypes.deposit})}}
            // onAccountPress={(eventId, eventType) => Actions.recurringEventModal({eventId, eventType})}
          />

          <AccountGroup
            name='Recurring Expenses'
            data={expenseEvents}
            themeColor={colors.autumn}
            onAddPress={this._revealNew('recurringEventId', 'recurringModalVisible', recurringEventTypes.expense)}
            onAccountPress={this._setRecurringEvent}
            // onAddPress={() => {Actions.recurringEventModal({eventType: recurringEventTypes.expense})}}
            // onAccountPress={(eventId, eventType) => Actions.recurringEventModal({eventId, eventType})}
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

  _revealNew = (type, modalKey, eventType) => () => this.setState({[type]: '', [modalKey]: true, [eventType]: ''})

  _setCashAccountId = accountId => this.setState({cashAccountId: accountId, cashModalVisible: true})

  _setRecurringEvent = (eventId, eventType) => {
    this.setState({recurringModalVisible: true, recurringEventId: eventId, recurringEventType: eventType})
  }
}

export default Accounts
