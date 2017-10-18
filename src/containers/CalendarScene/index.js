import React, {Component} from 'react'
import {View, Text} from 'react-native'
import ScreenHOC from '../ScreenHOC'

export default class CalendarScene extends Component {
  render() {
    return (
      <ScreenHOC>
        <View>
          <Text>Calendar page</Text>
        </View>
      </ScreenHOC>
    )
  }
}
