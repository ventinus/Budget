import React, {Component} from 'react'
import {View, Text} from 'react-native'
import ScreenHOC from '../ScreenHOC'

export default class Home extends Component {
  render() {
    return (
      <ScreenHOC
        header={(
          <Text style={{textAlign: 'center'}}>Home Page</Text>
        )}
      >
        <View>
          <Text>Home page</Text>
        </View>
      </ScreenHOC>
    )
  }
}
