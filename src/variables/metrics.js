import {Platform, Dimensions} from 'react-native'

const {height, width} = Dimensions.get('window')

const metrics = {
  statusBarHeight: Platform.select({ios: 22, android: 0}),
  navBarHeight: 35,
  sidePadding: 20,

  inputHeight: 40,
  deviceHeight: height,
  deviceWidth: width
}

export default metrics
