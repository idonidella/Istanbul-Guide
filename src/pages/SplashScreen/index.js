import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { authService } from '../../networking/api';
import store from '../../store';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = store.auth.data.token;
        console.log('Token:', token);
        if (token) {
          const response = await authService.checkSession(token);
          console.log('Session kontrol sonucu:', response.data);
          store.signIn(response.data);
          navigation.navigate('Main');
        } else {
          navigation.navigate('Login-Page');
        }
      } catch (error) {
        console.warn('Session kontrol hatası:', error.message);
        navigation.navigate('Login-Page');
      }
    };
    checkUserSession();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#382e48', '#2a5298', '#382e48']}
        style={styles.background}
      />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../../assets/logo/logo-Photoroom.png")} />
        <Text style={styles.subtitle}>Discover the city with QR</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>All Rights Reserved</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  logo: {
    height: 130,
    width: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  qrIconContainer: {
    position: 'absolute',
    bottom: height * 0.25,
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  footerSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  }
});

export default SplashScreen;
