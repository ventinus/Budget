import React from 'react'
// import FAIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';


export const HomeIcon = ({size = 30, color = '#900'}) => (<EntypoIcon name="home" size={size} color={color} />)

export const AccountIcon = ({size = 30, color = '#900'}) => (<MIcon name="account-balance" size={size} color={color} />)

export const CalendarIcon = ({size = 30, color = '#900'}) => (<FeatherIcon name="calendar" size={size} color={color} />)

export const SettingsIcon = ({size = 30, color = '#900'}) => (<MIcon name="settings" size={size} color={color} />)

export const BackIcon = ({size = 35, color = '#777'}) => (<FeatherIcon name='chevron-left' size={size} color={color} />)
