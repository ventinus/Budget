import React from 'react'
import {View, StatusBar} from 'react-native'
import {layoutStyles} from '../variables'

const ScreenHOC = ({children}) => (
  <View style={layoutStyles}>
    {children}
  </View>
)

export default ScreenHOC
