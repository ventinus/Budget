// @flow
// CalendarScene Component
import {connect} from 'react-redux'
import {groupEventsByDate} from '../../utils'
import CalendarScene from './CalendarScene'

const mapStateToProps = ({recurringEvents}) => ({
  groupedRecurringEvents: groupEventsByDate(recurringEvents)
})

export default connect(mapStateToProps)(CalendarScene)
