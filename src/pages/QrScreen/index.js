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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

import AxiosInstance from '../../networking/AxiosInstance';
import store from '../../store';
import Headers from '../../components/Headers';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function QRCodeVisualScreen({ navigation }) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        console.error("Camera permission not granted:", error);
        Alert.alert("Error", "Camera permission not granted");
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

  const handleQrScan = async (qrCode) => {
    setIsLoading(true);
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
        Alert.alert(
          'Invalid QR',
          'This QR code does not match a place.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error fetching place with QR code:', error);
      Alert.alert(
        'Operation Failed',
        'QR code cannot be read or the server is not responding. Please try again.',
        [{ text: 'Tamam', style: 'default' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScan = async () => {
    // if (isEmulatorSync()) {
    //   Alert.alert(
    //     'Emülatör Uyarısı',
    //     'Kamera emülatörde kullanılamaz. Örnek için Ayasofya sayfasına yönlendiriliyorsunuz.',
    //     [
    //       {
    //         text: 'Tamam',
    //         onPress: () => handleQrScan('qr_ayasofya_1010'),
    //       }
    //     ]
    //   );
    //   return;
    // }
    if (!hasPermission) {
      const newPermission = await Camera.requestCameraPermission();
      if (newPermission !== 'granted') {
        Alert.alert('Kamera İzni Gerekli', 'QR kod taraması için kamera izni vermeniz gerekmektedir.');
        return;
      }
      setHasPermission(true);
    }
    if (!device) {
      Alert.alert('Cihaz Hatası', 'Kamera cihazınız bulunamadı veya kullanılamıyor.');
      return;
    }
    setIsScanning(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headers navigation={navigation} />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#2A2438', '#2A2438']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.headerSection}></View>
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={['#3F3356', '#2D2342']}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.qrContainer}>
                <Image
                  source={require('../../assets/qr/sample-qr.png')}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
                <View style={styles.overlayIconContainer}>
                  <View style={styles.qrCorner} />
                </View>
              </View>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleStartScan}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#8E6CEF', '#7B68EE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <Image
                        source={require('../../assets/qr/scanbarcode.png')}
                        style={styles.buttonIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.scanButtonText}>Scan QR Code</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.instructionText}>
                Hold your camera over the QR code.
                When the QR code is scanned, the relevant content will be displayed automatically.
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: '#8E6CEF30' }]}>
                <Text style={styles.infoIconText}>1</Text>
              </View>
              <Text style={styles.infoText}>Press the Scan QR button</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: '#FF8C4230' }]}>
                <Text style={styles.infoIconText}>2</Text>
              </View>
              <Text style={styles.infoText}>Point the camera at the QR code</Text>
            </View>
            <View style={styles.infoItemFinal}>
              <View style={[styles.infoIcon, { backgroundColor: '#4ECB7130' }]}>
                <Text style={styles.infoIconText}>3</Text>
              </View>
              <Text style={styles.infoText}>Get information</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
      {isScanning && device && hasPermission && (
        <>
          <Camera
            style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />
          <View style={styles.scanFrame}>
            <View style={styles.scanCorner1} />
            <View style={styles.scanCorner2} />
            <View style={styles.scanCorner3} />
            <View style={styles.scanCorner4} />
          </View>
          <View style={styles.cancelButtonWrapper}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsScanning(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
  },
  gradient: {
    flex: 1,
    paddingBottom: 40,
  },
  headerSection: {
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#B8B5C0',
    marginBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    position: 'relative',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  overlayIconContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCorner: {
    width: 210,
    height: 210,
    borderWidth: 2,
    borderColor: '#8E6CEF',
    borderRadius: 16,
    position: 'absolute',
  },
  scanButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 10,
    shadowColor: '#8E6CEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
    tintColor: '#FFFFFF',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 14,
    color: '#B8B5C0',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  infoItemFinal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 150,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 16,
    color: '#E0DDE5',
    flex: 1,
  },
  scanFrame: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 250,
    height: 250,
    marginLeft: -125,
    marginTop: -125,
    zIndex: 2,
  },
  scanCorner1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#8E6CEF',
    borderTopLeftRadius: 10,
  },
  scanCorner2: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#8E6CEF',
    borderTopRightRadius: 10,
  },
  scanCorner3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#8E6CEF',
    borderBottomLeftRadius: 10,
  },
  scanCorner4: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#8E6CEF',
    borderBottomRightRadius: 10,
  },
  scanningText: {
    position: 'absolute',
    top: '60%',
    width: '100%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cancelButtonWrapper: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  cancelButton: {
    backgroundColor: 'rgba(30, 27, 38, 0.8)',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#8E6CEF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});