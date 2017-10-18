// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import {colors} from '../variables'

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparent,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: `${colors.white}aa`,
  },
  text: {
    color: `${colors.white}aa`
  }
}

const CircleButton = ({style, text, textStyle, size, onPress}) => (
  <TouchableOpacity onPress={onPress} style={[styles.container, style, {borderRadius: size / 2, width: size, height: size}]}>
    <Text style={[styles.text, textStyle]}>{text}</Text>
  </TouchableOpacity>
)

CircleButton.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  text: PropTypes.string,
  onPress: PropTypes.func
}

CircleButton.defaultProps = {
  style: {},
  textStyle: {},
  size: 20,
  text: '+/-',
  onPress: () => {console.log('define onPress for CircleButton component')}
}

export default CircleButton
