import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, StyleSheet, TextInput, Animated, TouchableHighlight,
  DatePickerIOS, DatePickerAndroid, Platform
} from 'react-native'
import {Drawer} from '.'
import {commonStyles, colors, metrics} from '../variables'

const styles = StyleSheet.create({
  textWrapper: {
    ...commonStyles.borderBottom,
    height: metrics.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 15
  }
})

export default class DateSelect extends Component {

  static propTypes = {
    date: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    label: PropTypes.string
  }

  static defaultProps = {
    label: 'Date:'
  }

  constructor (props) {
    super(props)

    this.state = {
      date: this.props.date,
      onChange: this.props.onChange
    }
  }

  render () {
    return this[`_render${Platform.OS}`]()
  }

  _dateText = () => (
    <View style={styles.textWrapper}>
      <Text style={styles.text}>{this.props.label}</Text>
      <Text style={styles.text}>{this.state.date.toDateString()}</Text>
    </View>
  )

  _renderios = () => (
    <Drawer
      containerStyle={commonStyles.inputPadding}
      drawerHeadComponent={this._dateText()}
    >
      <DatePickerIOS
        date={this.state.date}
        mode='date'
        onDateChange={this._updateDate}
      />
    </Drawer>
  )

  _renderandroid = () => (
    <View style={[commonStyles.inputPadding, commonStyles.borderBottom]}>
      <TouchableOpactiy onPress={this._displayAndroidPicker}>
        {this._dateText()}
      </TouchableOpactiy>
    </View>
  )

  _displayAndroidPicker = () => {
    DatePickerAndroid.open({
      date: this.state.date
    })
    .then(({ action, year, month, day }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        const newDate = new Date(year, month, day)

        this._updateDate(newDate)
      }
    })
    .catch(({ code, message }) => console.info(`Cannot open date picker ${code}`, message))
  }

  _updateDate = (date) => {
    this.setState({date})
    this.props.onChange(date)
  }

}
