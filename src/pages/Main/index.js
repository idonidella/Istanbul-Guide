import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('window');

const sliderImages = [
  { id: '1', name: 'Ayasofya', source: require('../../assets/slider/ayasofya.png') },
  { id: '2', name: 'Topkapı Sarayı', source: require('../../assets/slider/topkapisarayi.png') },
  { id: '3', name: 'Galata Kulesi', source: require('../../assets/slider/galatakulesi.png') },
  { id: '4', name: 'Sultanahmet Cami', source: require('../../assets/slider/sultanahmetcami.png') },
  { id: '5', name: 'Dolmabahçe Sarayı', source: require('../../assets/slider/dolmabahcesarayi.png') },
  { id: '6', name: 'Kız Kulesi', source: require('../../assets/slider/kizkulesi.png') },
  { id: '7', name: 'Kapalı Çarşı', source: require('../../assets/slider/kapalicarsi.png') },
  { id: '8', name: 'Yerebatan Sarnıcı', source: require('../../assets/slider/yerebatansarnaci.png') },
  { id: '9', name: 'Taksim Meydanı', source: require('../../assets/slider/taksimmeydani.png') },
  { id: '10', name: 'Pierre Loti Tepesi', source: require('../../assets/slider/pierrelotitepesi.png') },
];

const menuItems = [
  { title: 'En Çok Beğenilenler', icon: require('../../assets/main/like.png') },
  { title: 'Senin için Önerilen', icon: require('../../assets/main/recommended.png') },
  { title: 'Harita', icon: require('../../assets/main/map.png') },
  { title: 'Bana En Yakın Turizm Yapıları', icon: require('../../assets/main/nearby.png') },
];

const HomeScreen = ({ navigation }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % sliderImages.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleSliderScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  // Resme tıklandığında detay sayfasına yönlendirme fonksiyonu
  const handleImagePress = (id, name) => {
    navigation.navigate('Top-Turizm-Areas', {
      attractionId: id,
      attractionName: name
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.sliderWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            style={styles.sliderContainer}
            onMomentumScrollEnd={handleSliderScroll}
            decelerationRate="fast"
          >
            {sliderImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sliderImageContainer}
                onPress={() => handleImagePress(image.id, image.name)}
                activeOpacity={0.9}
              >
                <Image
                  source={image.source}
                  style={styles.sliderImage}
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageName}>{image.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.paginationContainer}>
          {sliderImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
        <Text style={styles.sectionTitle}>İstanbul'u Keşfet</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={() => navigation.navigate(item.title)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Image source={item.icon} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2A2438',
  },
  container: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  sliderWrapper: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  sliderContainer: {
    width: '100%',
    height: 250,
  },
  sliderImageContainer: {
    width,
    height: 250,
    position: 'relative',
  },
  sliderImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 7,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  paginationDot: {
    width: 10,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    width: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  menuContainer: {
    width: '92%',
    marginTop: 5,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 8,
    marginVertical: 8,
    borderWidth: 3,
    borderColor: "white",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
});