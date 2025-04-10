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
  require('../../assets/slider/ayasofya.png'),
  require('../../assets/slider/topkapisarayi.png'),
  require('../../assets/slider/galatakulesi.png'),
  require('../../assets/slider/sultanahmetcamii.png'),
  require('../../assets/slider/dolmabahcesarayi.png'),
  require('../../assets/slider/kizkulesi.png'),
  require('../../assets/slider/kapalicarsi.png'),
  require('../../assets/slider/yerebatansarnaci.png'),
  require('../../assets/slider/taksimmeydani.png'),
  require('../../assets/slider/pierrelotitepesi.png'),
];

const menuItems = [
  { title: 'Senin için Önerilen', icon: require('../../assets/main/recommended.png') },
  { title: 'Harita', icon: require('../../assets/main/map.png') },
  { title: 'En Çok Beğenilenler', icon: require('../../assets/main/like.png') },
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
              <View key={index} style={styles.sliderImageContainer}>
                <Image
                  source={image}
                  style={styles.sliderImage}
                />
              </View>
            ))}
          </ScrollView>
          
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
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 12,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 22,
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
    padding: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
});