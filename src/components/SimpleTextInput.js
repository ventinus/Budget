import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import {commonStyles, colors, metrics} from '../variables'

const styles = StyleSheet.create({
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.black,
  },
  textInput: {
    paddingHorizontal: 10,
    height: metrics.inputHeight,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.black,
    flexGrow: 2
  }
})

const SimpleTextInput = (props) => (
  <View style={commonStyles.inputPadding}>
    <View style={styles.borderBottom}>
      <TextInput
        style={styles.textInput}
        multiline={false}
        autoCorrect={false}
        {...props}
      />
    </View>
  </View>
)

export default SimpleTextInput
