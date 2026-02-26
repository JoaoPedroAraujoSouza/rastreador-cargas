import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/src/styles/colors';
import { AppIcons, MESSAGES } from '@/src/constants';
import { Button, Input, Card, Icon } from '@/src/components/ui';
import { useLogin } from '@/src/hooks/useLogin';

export default function LoginScreen() {
  const { login, senha, loading, setLogin, setSenha, handleLogin } = useLogin(
    (username) => {
      const message = MESSAGES.AUTH.LOGIN_SUCCESS.replace('{nome}', username);
      Toast.show({
        type: 'success',
        text1: MESSAGES.TITLES.SUCCESS,
        text2: message,
      });
    }
  );

  return (
    <LinearGradient colors={[Colors.darkBg, '#2d3748']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Icon
              name={AppIcons.truck}
              size={56}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.title}>Rastreador</Text>
            <Text style={styles.subtitle}>Cargo Tracking System</Text>
          </View>

          <Card>
            <Text style={styles.cardTitle}>Driver Login</Text>

            <Input
              label="Username"
              placeholder="Enter your username"
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={senha}
              onChangeText={setSenha}
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Button
              title="SIGN IN"
              onPress={handleLogin}
              loading={loading}
              variant="green"
            />
          </Card>

          <Text style={styles.footer}>Driver App v1.0</Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.mediumGray,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textWhite,
    marginBottom: 24,
    textAlign: 'center',
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: Colors.mediumGray,
    textAlign: 'center',
    opacity: 0.6,
  },
});
