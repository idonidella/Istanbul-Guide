import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert
} from 'react-native';
import { placeService, favoriteService } from '../../../networking/api';
import store from '../../../store';

const AttractionDetailScreen = ({ route, navigation }) => {
  const { attractionId } = route.params;
  const token = store.auth.data?.token;
  const [attraction, setAttraction] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const imageMap = {
    'Ayasofya Cami': require('../../../assets/slider/ayasofya.jpg'),
    'Topkapı Sarayı': require('../../../assets/slider/topkapisarayi.jpg'),
    'Galata Kulesi': require('../../../assets/slider/galatakulesi.jpg'),
    'Sultanahmet Camii': require('../../../assets/slider/sultanahmetcami.jpg'),
    'Dolmabahçe Sarayı': require('../../../assets/slider/dolmabahcesarayi.jpg'),
    'Kapalı Çarşı (Grand Bazaar)': require('../../../assets/slider/kapalicarsi.jpg'),
    'Yerebatan Sarnıcı': require('../../../assets/slider/yerebatansarnaci.jpg'),
    'Taksim Meydanı': require('../../../assets/slider/taksimmeydani.jpg'),
  };

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        const data = await placeService.getPlaceById(attractionId, token);
        console.log("data", data);  
        setAttraction(data);
        const favRes = await favoriteService.checkFavorite(attractionId, token);
        setIsFavorite(favRes.isFavorite);
      } catch (error) {
        console.warn("Yer bilgisi alınamadı", error);
        Alert.alert('Hata', 'Yer bilgisi alınamadı.');
      }
    };
    fetchAttraction();
  }, [attractionId]);
  

  const goBack = () => navigation.goBack();

  const openMap = () => {
    const { latitude, longitude } = attraction;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const toggleFavorite = async () => {
    try {
      console.log("Favori durumu kontrol ediliyor...", attractionId);
      const token = store.auth.data?.token;
      console.log("Token favori:", token);
      const response = await favoriteService.toggleFavorite(attractionId, token);
      setIsFavorite(response.isFavorite);
      Alert.alert('Bilgi', response.message);
    } catch (error) {
      Alert.alert('Hata', 'Favori işlemi yapılamadı.');
    }
  };


  if (!attraction) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Image source={require("../../../assets/global/goBack.png")} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Geri</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Text style={styles.favoriteEmoji}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainImageContainer}>
          <Image
            source={imageMap[attraction.name] || require('../../../assets/slider/istanbultotal.jpg')}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.attractionHeader}>
          <Text style={styles.attractionName}>{attraction.name}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{attraction.description}</Text>
        </View>
        <View style={styles.infoSection}>
          <TouchableOpacity style={styles.infoItem} onPress={openMap}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>
              Konum: {attraction.latitude}, {attraction.longitude}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AttractionDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2A2438',
  },
  container: {
    paddingBottom: 100,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#2A2438',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteEmoji: {
    fontSize: 24,
  },
  mainImageContainer: {
    width: '100%',
    height: 250,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  attractionHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  attractionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2438',
    marginBottom: 8,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
