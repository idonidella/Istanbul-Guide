import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native';

export default class LoginScreen extends Component {
  render() {
    return (
      <ImageBackground 
        source={require('../../../assets/bottomMenu/star.jpg')}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.topSpace} />
            
            <Text style={styles.headerText}>Giriş yap</Text>
            
            <Text style={styles.inputLabel}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="E-posta adresinizi girin"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi girin"
              placeholderTextColor="#777"
              secureTextEntry
            />
            
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loginButton} onPress={() => this.props.navigation.navigate('Main')}>
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>
            
            <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Register-Page')}>
                <Text style={styles.signupText}>Kayıt ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Daha şeffaf arka plan
  },
  topSpace: {
    height: 80,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Hafif beyaz kutu
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)', // İnce siyah çerçeve
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  forgotPasswordText: {
    color: '#C2BAB8FF',
    textAlign: 'right',
    marginBottom: 20,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4E4E4BFF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
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
    color: '#C2BAB8FF',
    fontWeight: 'bold',
  },
});