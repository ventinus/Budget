import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {toPairs} from 'lodash'
import moment from 'moment'
import {Modal} from '.'
import {commonStyles, colors} from '../variables'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  hdg: {
    textAlign: 'center',
    fontSize: 20
  },
  info: {
    textAlign: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15
  },
  btn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    borderColor: colors.black,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  btnCancel: {
    backgroundColor: colors.lightGrey
  },
  btnConfirm: {
    backgroundColor: colors.green,
    marginLeft: 20
  },
  btnText: {
    fontSize: 18
  }
})

class NotificationModal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isVisible !== nextProps.isVisible
  }

  render() {
    const {onCancel, onConfirm, isVisible, issue} = this.props

    const [date, issueData] = toPairs(issue)[0] || ['', {ids: []}]

    return (
      <Modal
        renderButtons={false}
        modalVisible={isVisible}
        name='notification'
      >
        <View style={styles.container}>
          <Text style={styles.hdg}>Are you sure?</Text>
          <Text style={styles.info}>Message: {issueData.message}</Text>
          <Text style={styles.info}>First Date: {moment(date, 'YYYY-MM-DD').format('MMM D, YY')}</Text>
          <Text style={styles.info}>Affected Account: {issueData.account}</Text>
          <Text style={styles.info}>Caused by: {issueData.ids.join(', ')}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.btn, styles.btnCancel]}
              onPress={onCancel}
            >
                <Text style={styles.btnText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnConfirm]}
              onPress={onConfirm}
            >
                <Text style={styles.btnText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

export default NotificationModal
