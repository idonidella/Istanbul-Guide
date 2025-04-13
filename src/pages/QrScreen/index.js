import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert
} from 'react-native';

import AxiosInstance from '../../networking/AxiosInstance';
import store from '../../store';
import Headers from '../../components/Headers';

export default function QRCodeVisualScreen({ navigation }) {
  const [qrCode] = useState('qr_topkapi_2020'); // Test için sabit QR



  const getPlaceByQrCode = async (qrCode) => {
    try {
      const token = store.auth.data.token;
      const response = await AxiosInstance.get('/places/qr', {
        params: { code: qrCode },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const place = response.data;
      if (place && place.id) {
        navigation.navigate('Top-Turizm-Areas', { attractionId: place.id });
      } else {
        Alert.alert("Geçersiz QR", "Yapı bulunamadı.");
      }
    } catch (error) {
      console.error("QR kod ile yapı getirme hatası:", error);
      Alert.alert('Hata', 'QR kod geçersiz veya sunucu hatası oluştu.');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Headers navigation={navigation} />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>QR Code</Text>
            <View style={styles.qrContainer}>
              <Image
                source={require('../../assets/qr/sample-qr.png')}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <Text style={styles.qrLabel}>My QR Code</Text>
            </View>
            <View style={styles.form}>
              <TouchableOpacity style={styles.generateButton} onPress={() => getPlaceByQrCode(qrCode)}>
                <Text style={styles.generateButtonText}>Generate QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2438',
  },
  scrollContent: {
    flex: 1,
    paddingBottom: 80,
  },
  cardContainer: {
    justifyContent: 'center',
    marginTop: 50,
  },
  card: {
    backgroundColor: '#382e48',
    borderRadius: 15,
    paddingVertical: 50,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#302942',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3d3352',
  },
  qrImage: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  qrLabel: {
    marginTop: 15,
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  form: {
    marginTop: 10,
  },
  generateButton: {
    backgroundColor: '#7B68EE',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 3,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#7B68EE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3d3352',
  },
  bottomBarButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});
