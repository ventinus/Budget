import React, {Component, PropTypes} from 'react'
import {
  View, Text, TouchableOpacity,
  Modal as RNModal
} from 'react-native'
import styles from './styles'

export default class Modal extends Component {
  static propTypes = {
    onDone: PropTypes.func,
    onClose: PropTypes.func,
    renderButtons: PropTypes.bool,
    cancelText: PropTypes.string,
    doneText: PropTypes.string,
    modalVisible: PropTypes.bool,
    showDone: PropTypes.bool
  }

  static defaultProps = {
    onDone: () => {},
    onClose: () => {},
    renderButtons: true,
    cancelText: 'Cancel',
    doneText: 'Done',
    modalVisible: false,
    showDone: true
  }

  state = {
    modalVisible: this.props.modalVisible
  }

  componentWillReceiveProps({modalVisible}) {
    if (modalVisible !== this.props.modalVisible) {
      this.setState({modalVisible})
    }
  }

  render () {
    return (
      <View>
        <RNModal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          >
          <View style={styles.modalInner}>
            {this.props.renderButtons &&
              <View style={styles.btnsWrapper}>
                <TouchableOpacity onPress={this._closeModal}>
                  <Text style={styles.cancelText}>{this.props.cancelText}</Text>
                </TouchableOpacity>
                {this.props.showDone &&
                  <TouchableOpacity onPress={this._handleDone}>
                    <Text style={styles.doneText}>{this.props.doneText}</Text>
                  </TouchableOpacity>
                }
              </View>
            }
            { this.props.children }
          </View>
        </RNModal>
      </View>
    )
  }

  _closeModal = () => {
    this.setState({modalVisible: false})
    this.props.onClose()
  }

  _handleDone = () => {
    this.setState({modalVisible: false})
    this.props.onDone()
  }
}
