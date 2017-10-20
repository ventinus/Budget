import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableOpacity,
  Modal as RNModal
} from 'react-native'
import styles from './styles'

const Modal = props => (
  <View>
    <RNModal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      >
      <View style={styles.modalInner}>
        {props.renderButtons &&
          <View style={styles.btnsWrapper}>
            <TouchableOpacity onPress={props.onClose}>
              <Text style={styles.cancelText}>{props.cancelText}</Text>
            </TouchableOpacity>
            {props.showDone &&
              <TouchableOpacity onPress={props.onDone}>
                <Text style={styles.doneText}>{props.doneText}</Text>
              </TouchableOpacity>
            }
          </View>
        }
        { props.children }
      </View>
    </RNModal>
  </View>
)

Modal.propTypes = {
  onDone: PropTypes.func,
  onClose: PropTypes.func,
  renderButtons: PropTypes.bool,
  cancelText: PropTypes.string,
  doneText: PropTypes.string,
  modalVisible: PropTypes.bool,
  showDone: PropTypes.bool,
  name: PropTypes.string
}

Modal.defaultProps = {
  onDone: () => {},
  onClose: () => {},
  renderButtons: true,
  cancelText: 'Cancel',
  doneText: 'Done',
  modalVisible: false,
  showDone: true,
  name: 'default name'
}

export default Modal
