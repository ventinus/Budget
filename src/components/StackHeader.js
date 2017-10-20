import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

import {BackIcon} from '.'

import {metrics, colors} from '../variables'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.defaultPageBg,
    paddingTop: metrics.statusBarHeight
  },
  inner: {
    backgroundColor: colors.white,
    height: 50,
    position: 'relative'
  },
  backBtn: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0
  },
  title: {
    width: '100%',
    marginTop: 17,
    textAlign: 'center'
    // top: '50%',
    // left: '50%',
    // transform: [{translateX: '-50%'}, {translateY: '-50%'}]
  }
})

const StackHeader = (props) => (
  <View style={styles.container}>
    <View style={styles.inner}>
      <Text style={styles.title}>{props.title}</Text>
      <TouchableOpacity
        onPress={() => props.navigation.goBack(null)}
        style={styles.backBtn}
      >
        <View><BackIcon /></View>
      </TouchableOpacity>
    </View>
  </View>
)

export default StackHeader
