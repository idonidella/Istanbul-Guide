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
          this.setState(() => {
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
          });
        },
      );
      Alert.alert('Başarılı', 'İsim başarıyla güncellendi', [
        { text: 'Tamam', onPress: () => navigation.navigate('Main') },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Güncelleme sırasında bir sorun oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil Ayarları</Text>
      <Text style={styles.label}>Adınız</Text>
      <TextInput
        style={styles.input}
        value={firstname}
        onChangeText={setFirstname}
        placeholder="Adınız"
        placeholderTextColor="#ccc"
      />
      <Text style={styles.label}>Soyadınız</Text>
      <TextInput
        style={styles.input}
        value={lastname}
        onChangeText={setLastname}
        placeholder="Soyadınız"
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonGoBack} onPress={() => navigation.goBack()} disabled={loading}>
        <Text style={styles.goBackText}>Geri</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default observer(ProfileSettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2438',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  goBackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#FFFFFF',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 10,
    borderColor: '#3d3352',
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7B68EE',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonGoBack: {
    backgroundColor: 'gray',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
