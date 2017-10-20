import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native'
import moment from 'moment'
import {moneyFormat, findEventsByDate} from '../utils'
import {layoutStyles, colors, commonStyles, dateFormat, metrics} from '../variables'

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: colors.white,
    textAlign: 'center'
  }
})

const groupStyles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.sidePadding,
    paddingVertical: 15
  }
})

const DaySlide = props => (
  <View style={[layoutStyles, {borderWidth: 0, borderColor: 'red'}]}>
    <Text style={styles.title}>Breakdown for {props.momentDate.format('MMMM D, YYYY')}</Text>
    <ScrollView>
      <View style={[groupStyles.container, commonStyles.borderBottom]}>
        {props.hasPassed &&
          <Text>(Date has passed. Showing current account totals.)</Text>
        }
        <View style={[commonStyles.splitBetween, commonStyles.borderBottom]}>
          <Text>Accounts</Text>
          <Text>Total: {moneyFormat(props.totalCash)}</Text>
        </View>
        {props.cashAccounts.map((val, i) =>
          <View key={i} style={commonStyles.splitBetween}>
            <Text>{val.name}</Text>
            <Text>{moneyFormat(val.amount)}</Text>
          </View>
        )}
      </View>
      <Group
        title='Income Sources'
        noneMessage='No money coming in on this day'
        data={props.deposits}
      />
      <View style={commonStyles.borderBottom}/>
      <Group
        title='Recurring Expenses'
        noneMessage='No money going out on this day'
        data={props.expenses}
      />
    </ScrollView>
  </View>
)

const Group = ({title, noneMessage, data}) => (
  <View style={groupStyles.container}>
    <View style={[commonStyles.splitBetween, commonStyles.borderBottom]}>
      <Text>{title}</Text>
      <Text>{data.length > 0 ? moneyFormat(data.reduce((a, c) => a += c.amount, 0)) : ''}</Text>
    </View>
    {data.length === 0 &&
      <Text>{noneMessage}</Text>
    }
    {data.length > 0 &&
      <View>
        {data.map((val, i) =>
          <View
            key={i}
            style={{
              marginTop: 10,
              paddingTop: i > 0 ? 10 : 0,
              borderTopWidth: i > 0 ? StyleSheet.hairlineWidth : 0,
              borderTopColor: colors.black
            }}
          >
            <Text>Name: {val.name}</Text>
            <Text>Amount: {moneyFormat(val.amount)}</Text>
            <Text>Interval: {val.interval}</Text>
          </View>
        )}
      </View>
    }
  </View>
)

const mapStateToProps = (state, ownProps) => {
  const {recurringEvents, forecast, cashAccounts} = state
  const date = moment(ownProps.date, dateFormat)
  const events = findEventsByDate(recurringEvents, date)

  const deposits = events.filter(e => e.amount >= 0).map(e => recurringEvents[e.id])
  const expenses = events.filter(e => e.amount < 0).map(e => recurringEvents[e.id])

  const hasPassed = moment().isAfter(date)
  let todaysForecast = null
  let adjCashAccounts = cashAccounts

  // TODO: figure out a better way to do this
  if (!hasPassed) {
    todaysForecast = forecast.dates[ownProps.date]
    adjCashAccounts = Object.keys(adjCashAccounts).reduce((a, c) => ({
      ...a,
      [c]: {
        ...adjCashAccounts[c],
        ...todaysForecast[c]
      }
    }), {})
  }

  adjCashAccounts = Object.keys(adjCashAccounts).map(val => ({
    name: adjCashAccounts[val].name,
    amount: adjCashAccounts[val].amount,
    alert: adjCashAccounts[val].alert
  }))

  return {
    deposits,
    expenses,
    hasPassed,
    date: ownProps.date,
    momentDate: date,
    cashAccounts: adjCashAccounts,
    totalCash: adjCashAccounts.reduce((a, c) => a + c.amount, 0)
  }
}

DaySlide.propTypes = {date: PropTypes.string.isRequired}

export default connect(mapStateToProps)(DaySlide)
