import {StyleSheet, Platform, Dimensions} from 'react-native'

export default StyleSheet.create({
  modalInner: {
    marginTop: Platform.select({ios: 22, android: 0}),
    backgroundColor: '#fff',
    flex: 1
  },
  btnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cancelText: {
    color: '#666666',
    padding: 10
  },
  doneText: {
    color: '#46cf98',
    padding: 10
  }
})
