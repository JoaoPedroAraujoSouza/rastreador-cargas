import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Colors from '@/src/styles/colors';
import { AppIcons, MESSAGES } from '@/src/constants';
import { Button, Input, Card, Icon } from '@/src/components/ui';
import { useLogin } from '@/src/hooks/useLogin';

export default function LoginScreen() {
  const router = useRouter();
  
  const { login, senha, loading, setLogin, setSenha, handleLogin } = useLogin(
    (nome) => {
      const message = MESSAGES.AUTH.LOGIN_SUCCESS.replace('{nome}', nome);
      Alert.alert(MESSAGES.TITLES.SUCCESS, message, [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/home');
          },
        },
      ]);
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
            <Text style={styles.subtitle}>Sistema de Rastreamento de Cargas</Text>
          </View>

          <Card>
            <Text style={styles.cardTitle}>Login do Motorista</Text>

            <Input
              label="Usuário"
              placeholder="Digite seu usuário"
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Button
              title="ENTRAR"
              onPress={handleLogin}
              loading={loading}
              variant="green"
            />
          </Card>

          <Text style={styles.footer}>App do Motorista v1.0</Text>
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
