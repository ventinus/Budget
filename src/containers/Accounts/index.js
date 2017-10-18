// Accounts Component
import {connect} from 'react-redux'
import Accounts from './Accounts'
import {findEventsByType} from '../../utils'
import {recurringEventTypes} from '../../variables'

const mapStateToProps = (state, ownProps) => ({
  budgets: state.budgets,
  cashAccounts: Object.values(state.cashAccounts),
  incomeEvents: findEventsByType(state.recurringEvents, recurringEventTypes.deposit),
  expenseEvents: findEventsByType(state.recurringEvents, recurringEventTypes.expense)
})

export default connect(mapStateToProps)(Accounts)
