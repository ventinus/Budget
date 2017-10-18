// @flow
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import {colors} from '../variables'

const styles = StyleSheet.create({
  selectBtn: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

class RadioSelect extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedIndex: props.selectedIndex || 0
    }
  }

  componentWillReceiveProps ({selectedIndex}) {
    this.setState({selectedIndex})
  }

  render() {
    const {style, items} = this.props
    return (
      <View style={[{flexDirection: 'row'}, style]}>
        {items.map((val, i) =>
          <TouchableOpacity
            key={i}
            style={[styles.selectBtn, val.style, {backgroundColor: this.state.selectedIndex === i ? colors.green : colors.grey}]}
            onPress={this._onItemPress.bind(this, i)}
          >
            <Text>{val.text}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  _onItemPress = index => {
    this.setState({selectedIndex: index}, () => {
      this.props.items[index].onPress(index)
    })
  }
}

export default RadioSelect
