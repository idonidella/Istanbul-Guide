import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Image, Alert, ActivityIndicator } from 'react-native';
import { authService } from '../../../networking/api';
import AxiosInstance from '../../../networking/AxiosInstance';
import store from '../../../store';

export default class LoginScreen extends Component {
  state = {
    email: '',
    password: '',
    showPassword: false,
    loading: false
  }

  handleLogin = async () => {
    const { email, password } = this.state;
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    this.setState({ loading: true });
    try {
      const response = await authService.login({
        email,
        password,
      });
      this.setState({ loading: false });
      console.log('Login response:', response.data.data);
      store.signIn(response.data.data);
      this.props.navigation.navigate('Main');
    } catch (error) {
      this.setState({ loading: false });
      console.log('Error SELAM:',);
      console.log('Registering user with data:', AxiosInstance);
      Alert.alert('Login Error', error.message);
    }
  }


  render() {

    const { loading } = this.state;

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
            <Text style={styles.headerText}>Sign In</Text>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={this.state.email}
                onChangeText={(text) => this.setState({ email: text })}
              />
            </View>
            <View style={{ marginTop: 13 }}>
              <Text style={styles.inputLabel}>Password</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!this.state.showPassword}
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })}
              />
            </View>
            {/* <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View> */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={this.handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>


            <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Register-Page')}>
                <Text style={styles.signupText}>Register</Text>
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
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 300,
    height: 110,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 60,
    textAlign: 'left'
  },
  inputLabel: {
    fontSize: 18,
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
    marginVertical: 20,
    marginTop: 45,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
  },
  noAccountText: {
    color: 'white',
  },
  signupText: {
    color: '#7B68EE',
    fontWeight: 'bold',
  },
});