import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import {commonStyles, colors, metrics} from '../variables'

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.black,
    flexGrow: 2,
    textAlign: 'right'
  }
})

const SimpleTextInput = (props) => (
  <View style={commonStyles.inputPadding}>
    <View style={[commonStyles.borderBottom, commonStyles.splitBetween, {paddingLeft: 10}]}>
      <Text style={{marginRight: 5}}>{props.label}:</Text>
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
