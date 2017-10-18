import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView} from 'react-native'
import ScreenHOC from '../ScreenHOC'

import {Modal} from '../../components'

export default class Settings extends Component {
  state = {
    modalVisible0: false,
    modalVisible1: false
  }

  render() {
    return (
      <ScreenHOC>
        <View>

          <TouchableOpacity onPress={this._openModal(0)}>
            <Text>Reveal!</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._openModal(1)}>
            <Text>Reveal!</Text>
          </TouchableOpacity>

          <Modal
            modalVisible={this.state.modalVisible0}
            onDone={() => console.log('done')}
            >
            <ScrollView>
              <View><Text>modal inner stuff</Text></View>
            </ScrollView>
          </Modal>

          <Modal
            modalVisible={this.state.modalVisible1}
            onDone={() => console.log('done')}
            >
            <ScrollView>
              <View><Text>second modal inner stuff</Text></View>
            </ScrollView>
          </Modal>
        </View>
      </ScreenHOC>
    )
  }

  _openModal = (index) => () => this.setState({[`modalVisible${index}`]: true})
}
