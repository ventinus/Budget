import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import moment from 'moment'
import {omit} from 'lodash'
import {Calendar} from 'react-native-calendars'
import {DrawerPicker, Drawer, MultiPickerDrawer, RadioSelect} from '.'
import {camelize} from '../utils'
import {commonStyles, colors, intervalTypes, ordinals, daysOfWeek, dateFormat} from '../variables'

// props
//  selectedInterval:
//    type:
//    frequency:
//  onValueChange
//  date
//  onDayChange

const DISTANCE_TYPES = [...ordinals, 'last'].map(value => {return {value} })
const DAY_TYPES = [...daysOfWeek, 'day', 'weekday', 'weekend day'].map(day => {
  return {
    label: day,
    value: day.split(' ').map(camelize).join('')
  }
})
const DEFAULT_SELECTED = {selected: true}
const DEFAULT_DISTANCE = DISTANCE_TYPES[0].value
const DEFAULT_DAY_TYPE = DAY_TYPES[0].value
const EACH_SELECTED_PROP = 'eachSelected'
const ON_THE_SELECTED_PROP = 'onTheSelected'

// when selectedInterval.type === intervalTypes.month, show two radio buttons below saying "Each" and "On the..."
// "each" reveals the ability to select several dates from the calendar and "on the..." shows two pickers
// with [first, second, third, fourth, fifth, last]
// and [sunday, monday, tuesday, wednesday, thursday, friday, saturday, day, weekday, weekend day]

// when selectedInterval.type === intervalTypes.week, show a multiselect with same styles as the radio buttons to select any/all days of the week
// not sure how to handle the dates with this one...
class IntervalTypesPicker extends Component {

  static propTypes = {}

  constructor (props) {
    super(props)

    this.state = {
      isOpen: false,
      [EACH_SELECTED_PROP]: true,
      [ON_THE_SELECTED_PROP]: false,
    }

    this._parseDates()

    this._pickerVals = props.selectedInterval
  }

  componentWillReceiveProps (nextProps) {
    // if you change month or year, reset all dates
    if (nextProps.date.substr(0, 7) !== this.props.date.substr(0, 7)) {
      this.setState({selectedDates: {[nextProps.date]: DEFAULT_SELECTED}})
    } else {
      // remove the previously selected one and add the new one
      this.setState({
        selectedDates: {
          ...omit(this.state.selectedDates, this.props.date),
          [nextProps.date]: DEFAULT_SELECTED
        }
      })
    }
  }

  render () {
    const {date} = this.props
    const {type, frequency} = this._pickerVals
    const {distance, dayType} = this._selectedRelativeDates

    return (
      <View style={{paddingBottom: this.state.isOpen ? 0 : 20}}>
        <Drawer
          isOpen={this._monthSelected() && this.state.isOpen}
          drawerHeadComponent={(
            <MultiPickerDrawer
              label='Repeat Every:'
              onDrawerChange={this._onDrawerChange}
              style={{paddingBottom: 0}}
              pickers={[
                {
                  pickerOptions: {
                    selectedValue: frequency,
                    displayValue: frequency,
                    onValueChange: this._onCountChange,
                  },
                  items: ['1','2','3','4','5'].map(value => {return {value}})
                }, {
                  pickerOptions: {
                    selectedValue: type,
                    displayValue: parseInt(frequency) === 1 ? type : `${type}s`,
                    onValueChange: this._onTypeChange,
                  },
                  items: Object.values(intervalTypes).map(value => {return {value}})
                }
              ]}
            />
          )}
        >
          <RadioSelect
            selectedIndex={this.state[EACH_SELECTED_PROP] ? 0 : 1}
            items={[
              {
                text: 'Each',
                onPress: this._selectEach
              }, {
                text: 'On the...',
                onPress: this._selectOn
              }
            ]}
          />
        </Drawer>

        <Drawer
          isOpen={this._pickerVals.type !== intervalTypes.day && this.state[EACH_SELECTED_PROP] && this.state.isOpen}
        >
          <Calendar
            hideArrows
            disableMonthChange
            hideExtraDays
            current={date}
            onDayPress={this._onDayPress}
            markedDates={this.state.selectedDates}
          />
        </Drawer>

        <MultiPickerDrawer
          isOpen={this._monthSelected() && this.state[ON_THE_SELECTED_PROP] && this.state.isOpen}
          pickers={[
            {
              pickerOptions: {
                selectedValue: distance,
                displayValue: distance,
                onValueChange: this._onDistanceChange
              },
              items: DISTANCE_TYPES
            }, {
              pickerOptions: {
                selectedValue: dayType,
                displayValue: !!dayType ? DAY_TYPES.find(t => t.value === dayType).label : dayType,
                onValueChange: this._onDayTypeChange
              },
              items: DAY_TYPES
            }
          ]}
        />
      </View>
    )
  }

  // returns true if month is selected in the intervalTypes drum
  _monthSelected = () => this._pickerVals.type === intervalTypes.month

  // updates pickerVals with new frequency
  _onCountChange = frequency => {
    this._updatePickerVal({frequency})
    this._sendPickerVals()
  }

  // sets general isOpen if intervalType is not day
  // if you change away from the month intervalType, it resets the
  // relative values (distance and dayType)
  _onTypeChange = type => {
    const isOpen = type !== intervalTypes.day
    this._updatePickerVal({type})
    let newSelectedState = {}

    if (type !== intervalTypes.month) {
      this._resetSelectedRelativeDates()

      newSelectedState = {
        [EACH_SELECTED_PROP]: true,
        [ON_THE_SELECTED_PROP]: false
      }
    }

    this.setState({isOpen, ...newSelectedState})
    this._sendPickerVals()
  }

  // sets the selected state of argument to true, after resetting both
  // selected can only be 'onTheSelected' and 'eachSelected'
  _setSelected = selected => {
    if (selected !== ON_THE_SELECTED_PROP && selected !== EACH_SELECTED_PROP) return

    this.setState({
      [EACH_SELECTED_PROP]: false,
      [ON_THE_SELECTED_PROP]: false,
      [selected]: true
    })
  }

  // when 'each' is clicked. resets 'on the...' values
  _selectEach = () => {
    this._setSelected(EACH_SELECTED_PROP)

    this._resetSelectedRelativeDates()
  }

  // when 'on the...' is clicked. sets the default values
  _selectOn = () => {
    this._setSelected(ON_THE_SELECTED_PROP)

    if (!this._selectedRelativeDates.distance && !this._selectedRelativeDates.dayType) {
      this._selectedRelativeDates = {
        distance: DEFAULT_DISTANCE,
        dayType: DEFAULT_DAY_TYPE
      }
    }

    this._sendNewDates({
      ...this.state.selectedDates,
      relDates: this._constructRelDates()
    })
  }

  _resetSelectedRelativeDates = () => {
    const omitted = this._omittedRelDates()
    this._selectedRelativeDates = {
      distance: null,
      dayType: null
    }
    this._sendNewDates(omitted)
  }

  _constructRelDates = () => {
    return `${this._selectedRelativeDates.distance}-${this._selectedRelativeDates.dayType}`
  }

  _omittedRelDates = () => {
    return omit(this.state.selectedDates, 'relDates')
  }

  // distance is the ['first', 'second'...] options under 'on the...'
  _onDistanceChange = distance => {
    const omitted = this._omittedRelDates()
    this._selectedRelativeDates.distance = distance

    this._sendNewDates({
      ...omitted,
      relDates: this._constructRelDates()
    })
  }

  // when drum with ['sunday', 'monday'...] changes
  _onDayTypeChange = dayType => {
    const omitted = this._omittedRelDates()
    this._selectedRelativeDates.dayType = dayType

    this._sendNewDates({
      ...omitted,
      relDates: this._constructRelDates()
    })
  }

  // a helper that accepts an options object argument to update _pickerVals easily
  _updatePickerVal = options => {
    this._pickerVals = {
      ...this._pickerVals,
      ...options
    }
  }

  // helper to execute props onIntervalChange callback
  _sendPickerVals = () => this.props.onIntervalChange(this._pickerVals)

  // updates the general isOpen flag that overrides all nested drawers. changes with
  // entry element press
  _onDrawerChange = isOpen => this.setState({isOpen})

  // when clicking a day in the calendar. if day is already selected, it removes it.
  // otherwise, it adds the new date to state selectedDates
  _onDayPress = ({dateString}) => {
    let newDates = {}
    if (this.state.selectedDates[dateString] && dateString !== this.props.date) {
      newDates = omit(this.state.selectedDates, dateString)
    } else {
      newDates = {
        ...this.state.selectedDates,
        [dateString]: DEFAULT_SELECTED
      }
    }

    this._sendNewDates(newDates)
  }

  _sendNewDates = selectedDates => {
    this.setState({selectedDates}, () => {
      this.props.onDayChange(this.state.selectedDates)
    })
  }

  _parseDates = () => {
    const {dateCollection, date} = this.props
    const defaultRelVals = {
      distance: null,
      dayType: null
    }

    const datesCollLength = dateCollection.length
    const lastDate = dateCollection[datesCollLength - 1]
    let lastDateIndex = datesCollLength
    if (datesCollLength > 0) {
      if (typeof lastDate === 'string') {
        const [distance, dayType] = lastDate.split('-')
        lastDateIndex = lastDateIndex - 1
        this._selectedRelativeDates = {distance, dayType}
      } else {
        this._selectedRelativeDates = defaultRelVals
      }

      this.state.selectedDates = dateCollection.slice(0, lastDateIndex).reduce((a, c) => {
        return {
          ...a,
          [moment(c).format(dateFormat)]: DEFAULT_SELECTED
        }
      }, {})
    } else {
      this._selectedRelativeDates = defaultRelVals
      this.state.selectedDates = { [date]: DEFAULT_SELECTED }
    }
  }
}

export default IntervalTypesPicker
