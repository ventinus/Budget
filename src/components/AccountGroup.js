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
    paddingVertical: 5,
    height: 40
  },
  accountBody: {
    paddingHorizontal: metrics.sidePadding,
    paddingVertical: 20
  }
})

const subsequentStyles = index => {
  return index === 0 ? {} : {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grey
  }
}

const AccountGroup = ({name, data, themeColor, onAddPress, onAccountPress, isEditing, onDeletePress}) => {
  return (
    <View>
      <View style={[commonStyles.splitBetween, styles.accountHeader, {backgroundColor: themeColor}]}>
        <Text style={{color: colors.white}}>{name}</Text>
        {!!onAddPress &&
          <CircleButton
            onPress={onAddPress}
            text='+'
            size={30}
            style={{borderColor: colors.white}}
            textStyle={{color: colors.white}}
          />
        }
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
            isEditing={isEditing}
            onPress={() => onAccountPress(parameterizeName(name), eventType)}
            onDeletePress={() => onDeletePress(parameterizeName(name))}
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
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  main: {
    flexDirection: 'column',
    flex: 1
  },
  bar: {
    marginVertical: 3,
    height: 1,
    backgroundColor: colors.black
  }
})

const AccountRow = ({style, leftText, topRightText, bottomLeftText, rightText, onPress, isEditing, onDeletePress}) => (
  <View style={[commonStyles.splitBetween, style]}>
    {isEditing &&
      <CircleButton
        onPress={onDeletePress}
        text='-'
        size={20}
        style={{borderColor: colors.red, backgroundColor: colors.red}}
        textStyle={{color: colors.white}}
      />
    }
    <TouchableOpacity
      style={[rowStyles.main, { marginLeft: isEditing ? 15 : 0 }]}
      onPress={onPress}>
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
  </View>
)

export default AccountGroup
