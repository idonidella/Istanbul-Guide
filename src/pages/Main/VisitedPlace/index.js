import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AxiosInstance from '../../../networking/AxiosInstance';
import store from '../../../store';

const imageMap = {
  'Ayasofya': require('../../../assets/slider/ayasofya.jpg'),
  'Topkapı Sarayı': require('../../../assets/slider/topkapisarayi.jpg'),
  'Galata Kulesi': require('../../../assets/slider/galatakulesi.jpg'),
  'Sultanahmet Camii': require('../../../assets/slider/sultanahmetcami.jpg'),
  'Dolmabahçe Sarayı': require('../../../assets/slider/dolmabahcesarayi.jpg'),
  'Kız Kulesi': require('../../../assets/slider/kizkulesi.jpg'),
  'Kapalı Çarşı': require('../../../assets/slider/kapalicarsi.jpg'),
  'Yerebatan Sarnıcı': require('../../../assets/slider/yerebatansarnaci.jpg'),
  'Taksim Meydanı': require('../../../assets/slider/taksimmeydani.jpg'),
  'Pierre Loti Tepesi': require('../../../assets/slider/pierrelotitepesi.jpg'),
};

export default function VisitedPlace({ navigation }) {
  const [visited, setVisited] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = store.auth.data?.token;

  const fetchVisitedPlaces = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get('/visited', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVisited(response.data);
    } catch (err) {
      console.log('Ziyaret edilen yer yok', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitedPlaces();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchVisitedPlaces();
    });

    return unsubscribe;
  }, [navigation]);

  const goToDetail = (placeId) => {
    navigation.navigate('Top-Turizm-Areas', { attractionId: placeId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => goToDetail(item.id)}
      style={styles.card}
      activeOpacity={0.9}
    >
      <Image
        source={imageMap[item.name] || imageMap['Ayasofya']}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.detailButton}>
          <Text style={styles.detailButtonText}>View Details</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No visited places found.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require("../../../assets/global/goBack.png")} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visited Places</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={visited}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyListComponent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2A2438',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 46,
    paddingBottom: 25,
    paddingHorizontal: 16,
},
backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
},
headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 5,
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  info: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 6,
  },
  desc: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 6,
  },
  detailButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
    paddingTop:330
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
});