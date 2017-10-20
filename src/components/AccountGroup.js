// @flow
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import {CircleButton} from '.'
import {moneyFormat, parameterizeName} from '../utils'
import {commonStyles, colors, metrics} from '../variables'

const styles = StyleSheet.create({
  accountHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: metrics.sidePadding,
    paddingVertical: 5
  },
  accountBody: {
    paddingHorizontal: metrics.sidePadding,
    paddingVertical: 20
  }
})

const subsequentStyles = index => {
  if (index === 0) return {}

  return {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grey
  }
}

const AccountGroup = ({name, data, themeColor, onAddPress, onAccountPress}) => {
  return (
    <View>
      <View style={[commonStyles.splitBetween, styles.accountHeader, {backgroundColor: themeColor}]}>
        <Text style={{color: colors.white}}>{name}</Text>
        <CircleButton
          onPress={onAddPress}
          text='+'
          size={30}
          style={{borderColor: colors.white}}
          textStyle={{color: colors.white}}
        />
      </View>

      <View style={styles.accountBody}>
        {data.length === 0 &&
          <Text>No {name}</Text>
        }

        {data.map(({name, amount, interval, date, eventType}, i) =>
          <AccountRow
            key={i}
            style={subsequentStyles(i)}
            leftText={name}
            topRightText={date}
            bottomLeftText={interval}
            rightText={amount}
            onPress={() => {console.log('press', eventType), onAccountPress(parameterizeName(name), eventType)}}
          />
        )}
      </View>
    </View>
  )
}

AccountGroup.propProps = {
  name: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  themeColor: PropTypes.string.isRequired,
  onAddPress: PropTypes.func.isRequired
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  bar: {
    marginVertical: 3,
    height: 1,
    backgroundColor: colors.black
  }
})

const AccountRow = ({style, leftText, topRightText, bottomLeftText, rightText, onPress}) => (
  <TouchableOpacity style={[rowStyles.container, style]} onPress={onPress}>
    <View style={commonStyles.splitBetween}>
      <Text>{leftText}</Text>
      <Text>{!topRightText ? '' : topRightText.toDateString()}</Text>
    </View>
    <View style={rowStyles.bar} />
    <View style={commonStyles.splitBetween}>
      <Text>{bottomLeftText}</Text>
      <Text>{moneyFormat(rightText)}</Text>
    </View>
  </TouchableOpacity>
)

export default AccountGroup
