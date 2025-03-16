import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native';

export default class RegisterScreen extends Component {
  render() {
    return (
      <ImageBackground 
        source={require('../../../assets/bottomMenu/star.jpg')}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.topSpace} />
            
            <Text style={styles.headerText}>Kayıt ol</Text>
            
            <Text style={styles.inputLabel}>Ad Soyad</Text>
            <TextInput
              style={styles.input}
              placeholder="Adınızı ve soyadınızı girin"
              placeholderTextColor="#777"
            />
            
            <Text style={styles.inputLabel}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="E-posta adresinizi girin"
              placeholderTextColor="#777"
            />
            
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi girin"
              placeholderTextColor="#777"
              secureTextEntry
            />
            
            <Text style={styles.inputLabel}>Şifre Tekrar</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi tekrar girin"
              placeholderTextColor="#777"
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Hesap Oluştur</Text>
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.alreadyAccountText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity>
                <Text style={styles.loginText}>Giriş yap</Text>
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
    color: 'white', // Koyu renk yazı
    marginBottom: 30,
    textAlign: 'center'
  },
  optionText: {
    fontSize: 16,
    color: '#555', // Koyu renk yazı
    marginBottom: 20,
    textAlign: 'center'
  },
  // Sosyal buton stilleri kaldırıldı
  inputLabel: {
    fontSize: 16,
    color: 'white', // Koyu renk yazı
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Hafif beyaz kutu
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    color: '#333', // Koyu renk yazı
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
  registerButton: {
    backgroundColor: '#4E4E4BFF',
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
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  alreadyAccountText: {
    color: 'white', // Koyu renk yazı
  },
  loginText: {
    color: '#C2BAB8FF',
    fontWeight: 'bold',
  },
});