import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { pythonApi } from '../../../networking/pythonApi';
import Geolocation from '@react-native-community/geolocation';
import store from '../../../store';

export default class RecommendedPlaces extends Component {

  state = {
    loading: false,
    location: null,
    recommendations: []
  }

  getRecommendations = async () => {
    this.setState({ loading: true });
    console.log("EFE", store.auth.data.userId);
    console.log("EFE", this.state.location?.latitude);  
    try {
      const responseApı = await pythonApi.restartModel();
      console.log('Model restarted:', responseApı);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await pythonApi.getRecommendations({
        userId: store.auth.data.userId,
        latitude: this.state.location?.latitude,
        longitude: this.state.location?.longitude,
        topN: 3
      });
      console.log('Öneriler:', response);
      let mappedResponse = [];
      if (response && Array.isArray(response.recommendations)) {
        mappedResponse = response.recommendations.map(item => ({
          ...item,
          id: item.place_id
        }));
      } else {
        console.log('Unexpected response:', response);
      }

      console.log('Öneriler:', mappedResponse);
      this.setState({ recommendations: mappedResponse, loading: false });
    } catch (error) {
      console.log('Recommendations could not be fetched:', error);
      this.setState({ loading: false });
    }
  }

  renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        this.props.navigation.navigate('Top-Turizm-Areas', {
          attractionId: item.id
        })
      }
    >
      <Image source={require("../../../assets/slider/istanbul.jpg")} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.name}>{item.name}</Text>
        {item.distance !== undefined && (
          <Text style={styles.desc}>
            Distance: {item.distance.toFixed(2)} km
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  componentDidMount() {
    this.setState({ loading: true }, () => {
      this.requestLocationPermission();
    });
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      this.getLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Konum İzni",
            message: "Uygulamanın konumunuza erişmesi gerekiyor",
            buttonNeutral: "Daha Sonra Sor",
            buttonNegative: "İptal",
            buttonPositive: "Tamam"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getLocation();
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Konum bilgisi:', position);
        this.setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }, () => {
          // Get recommendations after location is set
          this.getRecommendations();
        });
      },
      (error) => {
        console.log('Konum hatası:', error);
        // Even if location fails, try to get recommendations
        this.getRecommendations();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
            <Image source={require("../../../assets/global/goBack.png")} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recommended for you</Text>
        </View>
        {this.state.loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading recommendations...</Text>
          </View>
        ) : this.state.recommendations.length > 0 ? (
          <FlatList
            data={this.state.recommendations}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No recommendations found for you</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2438',
    paddingHorizontal: 16
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  header: {
    backgroundColor: '#2A2438',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 46,
    paddingBottom: 25,
    marginBottom: 8,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#FFFFFF',
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#382e48',
  },
  image: {
    width: '100%',
    height: 180,
  },
  overlay: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  desc: {
    color: '#CCCCCC',
    fontSize: 13,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
});
