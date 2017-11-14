// @flow

// Reveals content by animating the height of the children elements.
// The prop drawerHeadComponent is the visible portion of the Drawer
// component that, when clicked/pressed, reveals the props.children.
// Full component container styles are customizable with containerStyle
// prop, drawerHeadStyle controls the wrapping styles of the visible
// component (one layer above the TouchableOpacity), and drawerStyle
// is the animated portion of the component.
// onChange passes one argument, a boolean, which is the value of
// whether the drawer is expanded or not.
// if isOpen is specified, it overrides the default opening and closing
// and exclusively listens to componentWillReceiveProps

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native'

const isBoolean = thing => typeof thing === 'boolean'

export default class Drawer extends Component {
  static propTypes = {
    drawerHeadComponent: PropTypes.element,
    onChange: PropTypes.func,
    containerStyle: PropTypes.object,
    drawerHeadStyle: PropTypes.object,
    drawerStyle: PropTypes.object,
    isOpen: PropTypes.bool
  }

  static defaultProps = {
    onChange: () => {},
    containerStyle: {},
    drawerHeadStyle: {},
    drawerStyle: {}
  }

  state = {
    animatedHeight: new Animated.Value(),
    isExpanded: false
  }

  _setMaxHeight = (e) => {
    if (this.state.maxHeight) return

    this.setState({maxHeight: e.nativeEvent.layout.height})
    this.state.animatedHeight.setValue(0)
  }

  _toggle = (isOpen) => {
    let finalValue = 0

    if (isBoolean(isOpen)) {
      if (isOpen) finalValue = this.state.maxHeight
    } else {
      if (!this.state.isExpanded) finalValue = this.state.maxHeight
    }

    Animated.timing(
      this.state.animatedHeight,
      {
        toValue: finalValue,
        duration: 300
      }
    ).start()

    this.setState({isExpanded: !this.state.isExpanded}, () => {
      this.props.onChange(this.state.isExpanded)
    })
  }

  onDrawerPress = () => {
    this._toggle()
  }

  componentWillReceiveProps (nextProps) {
    if (isBoolean(nextProps.isOpen)) {
      this._toggle(nextProps.isOpen)
    }
  }

  render () {
    const Wrapper = isBoolean(this.props.isOpen) ? View : TouchableOpacity

    return (
      <View style={this.props.containerStyle}>
        {!!this.props.drawerHeadComponent &&
          <View style={this.props.drawerHeadStyle}>
            <Wrapper onPress={this.onDrawerPress.bind(this)}>
              {this.props.drawerHeadComponent}
            </Wrapper>
          </View>
        }
        <Animated.View
          onLayout={this._setMaxHeight}
          style={[{overflow: 'hidden'}, this.props.drawerStyle, {height: this.state.animatedHeight}]}
        >
          {this.props.children}
        </Animated.View>
      </View>
    )
  }
}

