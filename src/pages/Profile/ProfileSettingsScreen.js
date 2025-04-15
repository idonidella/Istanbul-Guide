import React, { useState } from 'react';
import { observer } from 'mobx-react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { authService } from '../../networking/api';
import store from '../../store';

const ProfileSettingsScreen = ({ navigation }) => {
  const user = store.auth.data;
  const token = user.token;
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!firstname || !lastname) {
      return Alert.alert('Uyarı', 'Ad ve soyad boş bırakılamaz');
    }

    setLoading(true);
    try {
      const response = await authService.updateName(firstname, lastname, token);
      console.log('Response:', response.data.data);
      store.setProfile(
        {
          firstname: response.data.data.firstname,
          lastname: response.data.data.lastname,
        },
        () => {
          Alert.alert(
            'BAŞARILI',
            'Profil bilgileriniz başarıyla güncellendi.',
            [
              {
                text: 'Tamam',
                onPress: () => navigation.goBack(),
              },
            ],
          );
        },
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Güncelleme sırasında bir sorun oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profil Ayarları</Text>
          <Text style={styles.subtitle}>Bilgilerinizi güncelleyebilirsiniz</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Adınız</Text>
            <TextInput
              style={styles.input}
              value={firstname}
              onChangeText={setFirstname}
              placeholder="Adınız"
              placeholderTextColor="#9590A8"
              selectionColor="#A593E0"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Soyadınız</Text>
            <TextInput
              style={styles.input}
              value={lastname}
              onChangeText={setLastname}
              placeholder="Soyadınız"
              placeholderTextColor="#9590A8"
              selectionColor="#A593E0"
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Kaydet</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={() => navigation.goBack()}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonOutlineText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default observer(ProfileSettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2438',
  },
  keyboardAvoid: {
    flex: 1,
    padding: 35,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9590A8',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 12,
    borderColor: '#3D3352',
    borderWidth: 1,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#7B68EE',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#5A5273',
    shadowOpacity: 0.1,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5A5273',
    borderWidth: 1.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonOutlineText: {
    color: '#A593E0',
    fontSize: 16,
    fontWeight: '600',
  },
});