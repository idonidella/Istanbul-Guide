import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

import AxiosInstance from '../../networking/AxiosInstance';
import store from '../../store';
import Headers from '../../components/Headers';
import { isEmulatorSync } from 'react-native-device-info';

export default function QRCodeVisualScreen({ navigation }) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: async (codes) => {
      const code = codes[0]?.value;
      if (code) {
        setIsScanning(false);
        await handleQrScan(code);
      }
    }
  });

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const permission = await Camera.requestCameraPermission();
        setHasPermission(permission === "granted");
      } catch (error) {
        console.error("Kamera izni alınamadı:", error);
        Alert.alert("HATA", "Kamera izni alınamadı");
      }
    };
    requestCameraPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsScanning(false);
    });
  
    return unsubscribe;
  }, [navigation]);
  

  // QR kodu backend'e gönder
  const handleQrScan = async (qrCode) => {
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
        Alert.alert('Geçersiz QR', 'Yapı bulunamadı.');
      }
    } catch (error) {
      console.error('QR kod ile yapı getirme hatası:', error);
      Alert.alert('Hata', 'QR kod geçersiz veya sunucu hatası oluştu.');
    }
  };

  const handleStartScan = async () => {
    if (isEmulatorSync()) {
      Alert.alert(
        'Emülatör Uyarısı',
        'Kamera emülatörde kullanılamaz. Örnek için Ayasofya sayfasına yönlendiriliyorsunuz.',
        [
          {
            text: 'Tamam',
            onPress: () => handleQrScan('qr_ayasofya_1010'),
          }
        ]
      );
      return;
    }
    if (!hasPermission) {
      const newPermission = await Camera.requestCameraPermission();
      if (newPermission !== 'granted') {
        Alert.alert('Hata', 'Kamera izni verilmedi.');
        return;
      }
      setHasPermission(true); 
    }
    if (!device) {
      Alert.alert('Hata', 'Kamera cihazı bulunamadı.');
      return;
    }
    setIsScanning(true);
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
              <TouchableOpacity style={styles.generateButton} onPress={handleStartScan}>
                <Text style={styles.generateButtonText}>Generate QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {isScanning && device && hasPermission && (
        <>
          <Camera
            style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />
          <Image
            source={require('../../assets/qr/scanbarcode.png')}
            style={styles.scanOverlay}
          />
          <View style={styles.cancelButtonWrapper}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsScanning(false)}
            >
              <Text style={styles.cancelButtonText}>İptal Et</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  scanOverlay: {
    position: "absolute",
    width: 220,
    height: 220,
    top: "40%",
    left: "50%",
    marginLeft: -110,
    marginTop: -110,
    zIndex: 2,
    opacity: 0.9,
  },
  cancelButtonWrapper: {
    position: "absolute",
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },
  cancelButton: {
    backgroundColor: "#00000090",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff"
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  }
});
