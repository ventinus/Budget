import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Picker} from 'react-native'
const {Item} = Picker
import {map} from 'lodash'
import ScreenHOC from '../ScreenHOC'

import {intervalTypes, currencies} from '../../variables'

const styles = {
  projection: {

    flexDirection: 'row'
  },
  picker: {flex: 1}
}

export default class Settings extends Component {
  constructor(props) {
    super(props)

    this._currencyAbbrs = Object.keys(currencies)

    this._projectionDistances = {
      day: 365,
      week: 56,
      month: 12,
      year: 1
    }
  }

  render() {
    const {currency, projection} = this.props.settings
    return (
      <ScreenHOC>
        <ScrollView style={{flex: 1}}>

          <Picker
            selectedValue={currency}
            onValueChange={this._onItemChange('currency')}>
            {this._currencyAbbrs.map((val, i) =>
              <Item key={i} value={val} label={`${val} (${currencies[val].symbol})`} />
            )}
          </Picker>

          <View style={styles.projection}>
            <Picker
              style={styles.picker}
              selectedValue={projection.count}
              onValueChange={this._updateProjection('count')}>
              {this._numMap(this._projectionDistances[projection.type])}
            </Picker>
            <Picker
              style={styles.picker}
              selectedValue={projection.type}
              onValueChange={this._updateProjection('type')}>
              {map(intervalTypes, (k, val, i) =>
                <Item key={i} value={val} label={k} />
              )}
            </Picker>
          </View>
        </ScrollView>
      </ScreenHOC>
    )
  }

  _onItemChange = key => value => {
    this.props.updateSettings({
      [key]: value
    })
  }

  _updateProjection = key => value => {
    this.props.updateProjection({
      projection: {
        ...this.props.settings.projection,
        [key]: value
      }
    })
  }

  // _pickerItem = (num) =>

  _numMap = (end) => {
    const items = []
    for (let i = 1; i < end; i++) {
      items.push((<Item key={i} value={i} label={`${i}`} />))
    }
    return items
  }
}
