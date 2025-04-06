import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API servisi importu - networking klasörünüzde oluşturmanız gerekiyor
import { authService } from '../../../networking/api';

export default class RegisterScreen extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    loading: false
  }

  handleRegister = async () => {
    const { name, email, password, confirmPassword } = this.state;
    
    // Form validasyonu
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }
    
    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin');
      return;
    }
    
    this.setState({ loading: true });
    
    try {
      // Ad Soyad'dan username oluşturma
      const username = name.replace(/\s+/g, '').toLowerCase();
      
      // API'ye kayıt isteği gönderme
      await authService.register({
        username,
        email,
        password,
      });
      
      this.setState({ loading: false });
      
      Alert.alert(
        'Başarılı',
        'Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.',
        [{ text: 'Tamam', onPress: () => this.props.navigation.navigate('Login-Page') }]
      );
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert('Kayıt Hatası', error.message);
    }
  }


  render() {
    const { loading } = this.state;
    return (
      <View style={styles.backgroundContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Register Header */}
            <Text style={styles.headerText}>Kayıt ol</Text>
            
            {/* Ad Soyad Input */}
            <Text style={styles.inputLabel}>Ad Soyad</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Adınızı ve soyadınızı girin"
                placeholderTextColor="#999"
                autoCapitalize="words"
                value={this.state.name}
                onChangeText={(text) => this.setState({ name: text })}
              />
            </View>
            
            {/* Email Input */}
            <Text style={styles.inputLabel}>E-posta</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-posta adresinizi girin"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={this.state.email}
                onChangeText={(text) => this.setState({ email: text })}
              />
            </View>
            
            {/* Password Input */}
            <Text style={styles.inputLabel}>Şifre</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi girin"
                placeholderTextColor="#999"
                secureTextEntry={!this.state.showPassword}
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })}
              />
            </View>
            
            {/* Confirm Password Input */}
            <Text style={styles.inputLabel}>Şifre Tekrar</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor="#999"
                secureTextEntry={!this.state.showConfirmPassword}
                value={this.state.confirmPassword}
                onChangeText={(text) => this.setState({ confirmPassword: text })}
              />
            </View>
            
            {/* Register Button */}
            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={this.handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Hesap Oluştur</Text>
              )}
            </TouchableOpacity>
            
            {/* Login Option */}
            <View style={styles.loginContainer}>
              <Text style={styles.haveAccountText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login-Page')}>
                <Text style={styles.loginText}>Giriş Yap</Text>
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
    paddingTop: 70,
  },
  headerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C2BAB8',
    marginBottom: 30,
    height: 40,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: '#7B68EE', 
    height: 50,
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 30,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  haveAccountText: {
    color: 'white',
  },
  loginText: {
    color: '#7B68EE', 
    fontWeight: 'bold',
  },
});