import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import store from '../../../store';
import { authService } from '../../../networking/api';

export default class RegisterScreen extends Component {
  state = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    loading: false
  }

  handleRegister = async () => {
    this.setState({ loading: true });
    const { firstname, lastname, email, password, confirmPassword } = this.state;
    // Form validasyonu
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      this.setState({ loading: false });
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      this.setState({ loading: false });
      return;
    }
    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    try {
      const { firstname, lastname, email, password } = this.state;
      const response = await authService.register({
        firstname,
        lastname,
        email,
        password,
      });
      this.setState({ loading: false });
      console.log("efe register", response.data.data);
      await store.signIn(response.data.data);
      Alert.alert(
        'Success',
        'Your account has been created successfully. You can now sign in.',
        [{ text: 'OK', onPress: () => this.props.navigation.navigate('Login-Page') }]
      );
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert('Registration Error', error.message);
    }
  }


  render() {
    const { loading } = this.state;
    return (
      <View style={styles.backgroundContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.headerText}>Register</Text>
            <Text style={styles.inputLabel}>First Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#999"
                autoCapitalize="words"
                value={this.state.name}
                onChangeText={(text) => this.setState({ firstname: text })}
              />
            </View>
            <Text style={styles.inputLabel}>Last Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Soyadınızı girin"
                placeholderTextColor="#999"
                autoCapitalize="words"
                value={this.state.name}
                onChangeText={(text) => this.setState({ lastname: text })}
              />
            </View>

            {/* Email Input */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={this.state.email}
                onChangeText={(text) => this.setState({ email: text })}
              />
            </View>

            {/* Password Input */}
            <Text style={styles.inputLabel}>Password</Text>
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
            <Text style={styles.inputLabel}>Repeat Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Repeat Password"
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
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Option */}
            <View style={styles.loginContainer}>
              <Text style={styles.haveAccountText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login-Page')}>
                <Text style={styles.loginText}>Sign In</Text>
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
  },
  headerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 35,
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