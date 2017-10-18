import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import {commonStyles, colors} from '../variables'

const MONEY_RE = /(\d*\.?\d{0,2})/

const AmountInput = ({value, onFocus, onChangeText, onBlur, options}) => {
  const validateCents = input => input.match(MONEY_RE)[0]

  const onChange = input => onChangeText(validateCents(input))

  return (
    <View style={commonStyles.inputPadding}>
      <View style={[commonStyles.borderBottom, commonStyles.splitBetween]}>
        <Text style={{marginRight: 5}}>$</Text>
        <TextInput
          style={styles.textInput}
          value={`${value}`.replace(/-/, '')}
          onFocus={onFocus}
          onChangeText={onChange}
          onBlur={onBlur}
          multiline={false}
          autoCorrect={false}
          keyboardType='numeric'
          {...options}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.black,
    flexGrow: 2
  }
})

export default AmountInput
