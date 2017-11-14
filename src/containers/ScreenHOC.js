import React from 'react'
import {View, StatusBar, StyleSheet} from 'react-native'
import {layoutStyles, commonStyles} from '../variables'

const headerStyles = {
  paddingVertical: 15,
  ...commonStyles.borderBottom
}

const ScreenHOC = ({header = null, children}) => (
  <View style={layoutStyles}>
    {!!header &&
      <View style={headerStyles}>{header}</View>
    }
    {children}
  </View>
)

export default ScreenHOC
