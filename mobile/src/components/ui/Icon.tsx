import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';
import { IconName } from '../../constants/icons';
import Colors from '../../styles/colors';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export default function Icon({ 
  name, 
  size = 24, 
  color = Colors.textWhite,
  style 
}: IconProps) {
  return (
    <MaterialCommunityIcons 
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
}
