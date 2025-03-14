import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native';

export default class LoginPage extends Component {
  render() {
    return (
      <ImageBackground 
        source={require('../../../assets/bottomMenu/sunset.jpeg')}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.topSpace} />
            
            <Text style={styles.headerText}>Giriş yap</Text>
            
            <Text style={styles.optionText}>Aşağıdaki seçeneklerden biriyle giriş yap</Text>
            
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.googleIconContainer}>
                  <Text style={styles.googleText}>G</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.appleIconContainer}>
                  <Text style={styles.appleText}>A</Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="E-posta adresinizi girin"
              placeholderTextColor="#aaa"
            />
            
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi girin"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>
            
            <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>Hesabınız yok mu? </Text>
              <TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.3)', 
    padding: 20,
  },
  topSpace: {
    height: 100, // İçeriği aşağı indirmek için ekstra boşluk
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    textAlign: 'center'
  },
  optionText: {
    fontSize: 16,
    color: '#f5f5f5',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    width: '48%',
    height: 50,
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44838FF',
    borderRadius: 14,
  },
  googleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appleIconContainer: {
    width: 28,
    height: 28,
    backgroundColor: '#0077ed',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  loginButton: {
    backgroundColor: '#ff7e5f',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    color: '#f5f5f5',
  },
  signupText: {
    color: '#ff7e5f',
    fontWeight: 'bold',
  },
});