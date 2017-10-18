import {StyleSheet} from 'react-native'
import metrics from './metrics'
import colors from './colors'

export const layoutStyles = {
  paddingTop: metrics.statusBarHeight,
  backgroundColor: colors.defaultPageBg,
  flex: 1
}

export const commonStyles = {
  splitBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.black,
  },
  inputPadding: {
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20
  }
}
