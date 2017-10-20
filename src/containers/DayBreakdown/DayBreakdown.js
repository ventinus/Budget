// @flow
import React, {Component} from 'react'
import {DaySlide} from '../../components'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder
} from 'react-native'
import {now} from 'lodash'
import moment from 'moment'
// import {moneyFormat} from '../../utils'
import {layoutStyles, colors, commonStyles, dateFormat, metrics} from '../../variables'
import {styles} from './styles.js'

class DayBreakdown extends Component {
  constructor (props) {
    super(props)

    this._panResponder = {}
    this._containerWidth = metrics.deviceWidth * 3
    this._preventHorizontalMvt = null

    this._positions = {
      left: 0,
      center: metrics.deviceWidth * -1,
      right: metrics.deviceWidth * -2
    }

    this._threshold = metrics.deviceWidth / 2

    this._previousX = this._positions.center
    this._touchStart = 0
    this._change = 0
    const {date} = props.navigation.state.params
    this.state = {
      pan: new Animated.Value(this._positions.center),
      leftDate: moment(date).subtract(1, 'day'),
      centerDate: moment(date),
      rightDate: moment(date).add(1, 'day')
    }
  }

  componentWillMount () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
      onPanResponderTerminate: this._onPanResponderRelease
    })
  }

  render () {
    return (
      <Animated.View
        style={[styles.container, {
          width: this._containerWidth,
          transform: [{translateX: this.state.pan}]
        }]}
        {...this._panResponder.panHandlers}
      >
        <DaySlide date={this.state.leftDate.format(dateFormat)} />
        <DaySlide date={this.state.centerDate.format(dateFormat)} />
        <DaySlide date={this.state.rightDate.format(dateFormat)} />
      </Animated.View>
    )
  }

  _onPanResponderGrant = () => {
    this._touchStart = now()
  }

  _onPanResponderMove = (e, {dx, dy}) => {
    if (this._preventHorizontalMvt) return

    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (this._preventHorizontalMvt === null) {
      if (absDx > 5 || absDy > 5) {
        this._preventHorizontalMvt = absDx < absDy
      } else {
        return
      }
    }

    this.state.pan.setValue(this._previousX + dx)
  }

  _onPanResponderRelease = (e, {dx}) => {
    if (this._preventHorizontalMvt || dx === 0) {
      this._preventHorizontalMvt = null
      return
    }

    this._previousX = this._previousX + dx
    this._animateSlide(dx)
  }

  _animateSlide = (dx) => {
    const {left, center, right} = this._positions

    // was a flick
    if (now() - this._touchStart < 300) {
      if (dx < 0) {
        this._previousX = right
        this._change = 1
      } else {
        this._previousX = left
        this._change = -1
      }
    } else {
      if (this._previousX <= center - this._threshold) {
        this._previousX = right
        this._change = 1
      } else if (this._previousX >= center + this._threshold) {
        this._previousX = left
        this._change = -1
      } else {
        this._previousX = center
      }
    }

    Animated.timing(this.state.pan, {
      toValue: this._previousX,
      duration: 300,
    }).start(this._onTransitionComplete)
  }

  _onTransitionComplete = () => {
    const {center} = this._positions

    if (this._change === 0) return

    this.setState({
      leftDate: this.state.leftDate.add(this._change, 'day'),
      centerDate: this.state.centerDate.add(this._change, 'day'),
      rightDate: this.state.rightDate.add(this._change, 'day')
    }, () => {
      this.state.pan.setValue(center)
      this._previousX = center
      this._preventHorizontalMvt = null
      this._change = 0
    })

  }
}

export default DayBreakdown
