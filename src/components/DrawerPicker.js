import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Picker } from 'react-native'
import {Drawer} from '.'
import {commonStyles, colors, metrics} from '../variables'
const {Item} = Picker

const styles = StyleSheet.create({
  headWrapper: {
    ...commonStyles.borderBottom,
    height: metrics.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  headText: {fontSize: 15}
})

const DrawerPicker = ({label, selectedValue, onValueChange, onChange, style, pickerItems, pickerOptions}) => (
  <Drawer
    containerStyle={{...commonStyles.inputPadding, ...style}}
    drawerHeadComponent={(
      <View style={[styles.headWrapper, commonStyles.splitBetween]}>
        <Text>{label}</Text>
        <Text style={styles.headText}>{selectedValue}</Text>
      </View>
    )}
    onChange={onChange}
  >
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      {...pickerOptions}
    >
      {pickerItems.map((val, i) =>
        <Item label={val} value={val} key={i}>{val}</Item>
      )}
    </Picker>
  </Drawer>
)

export default DrawerPicker
