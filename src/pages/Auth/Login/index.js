import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';

export default class LoginScreen extends Component {
  state = {
    showPassword: false
  }

  render() {
    return (
      <View style={styles.backgroundContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            {/* Login Header */}
            <Text style={styles.headerText}>Giriş Yap</Text>
            
            {/* Email Input */}
            <Text style={styles.inputLabel}>E-Posta Adresi</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-Posta Adresi"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Password Input */}
            <Text style={styles.inputLabel}>Şifre</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#999"
                secureTextEntry={!this.state.showPassword}
              />
            </View>
            
            {/* Forgot Password */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
              </TouchableOpacity>
            </View>
            
            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={() => this.props.navigation.navigate('Main')}>
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>
            
            {/* Sign Up */}
            <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Register-Page')}>
                <Text style={styles.signupText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2438', 
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 50,
    paddingTop: 70, // Azaltıldı, logo için yer açmak amacıyla
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 250,
    height: 80,
  },
  headerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 80,
    textAlign: 'left'
  },
  inputLabel: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C2BAB8',
    marginBottom: 20,
    height: 50,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 10,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#7B68EE', 
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#7B68EE', 
    height: 50,
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noAccountText: {
    color: 'white',
  },
  signupText: {
    color: '#7B68EE', 
    fontWeight: 'bold',
  },
});