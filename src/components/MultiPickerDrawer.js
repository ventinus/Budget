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
  headText: {fontSize: 15},
  pickersWrapper: {
    flexDirection: 'row'
  },
  picker: {flex: 1}
})

const MultiPickerDrawer = ({label, style, onDrawerChange, isOpen, pickers = []}) => {
  const padding = !label ? {} : commonStyles.inputPadding
  return (
    <Drawer
      containerStyle={{...padding, ...style}}
      drawerHeadComponent={!label ? null : (
        <View style={[styles.headWrapper, commonStyles.splitBetween]}>
          <Text>{label}</Text>
          <Text style={styles.headText}>{pickers.map(p => p.pickerOptions.displayValue).join(' ')}</Text>
        </View>
      )}
      onChange={onDrawerChange}
      isOpen={isOpen}
    >
      <View style={styles.pickersWrapper}>
        {pickers.map((pick, i) =>
          <Picker
            {...pick.pickerOptions}
            key={i}
            style={[styles.picker, !!pick.pickerOptions ? pick.pickerOptions.style : {}]}
            // selectedValue={pick.selectedValue}
            // onValueChange={pick.onValueChange}
          >
            {pick.items.map((p, j) =>
              <Item key={j} label={p.label || p.value} value={p.value}>{p.value}</Item>
            )}
          </Picker>
        )}
      </View>
    </Drawer>
  )
}

export default MultiPickerDrawer
