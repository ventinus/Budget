import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {Modal} from '.'
import {commonStyles, colors} from '../variables'

class NotificationModal extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isVisible !== nextProps.isVisible
  }

  render() {
    const {onCancel, onConfirm, isVisible, issue} = this.props
    // console.log('notif', this.props)

    return (
      <Modal
        renderButtons={false}
        modalVisible={isVisible}
        name='notification'
      >
        <Text>Are you sure? This will create an issue on [date]</Text>

        <View>
          <TouchableOpacity onPress={onCancel}><Text>No</Text></TouchableOpacity>
          <TouchableOpacity onPress={onConfirm}><Text>Yes</Text></TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

export default NotificationModal
