import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/src/styles/colors';
import { AppIcons } from '@/src/constants/icons';
import { Icon } from '@/src/components/ui';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Icon
        name={AppIcons.truck}
        size={64}
        color={Colors.primary}
      />
      <Text style={styles.text}>Home Screen - Em breve!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.darkBg,
  },
  text: {
    fontSize: 20,
    color: Colors.textWhite,
  },
});
