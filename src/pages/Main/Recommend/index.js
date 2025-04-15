import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

const dummyRecommendedPlaces = [
  {
    id: 1,
    name: 'Ayasofya',
    description: 'İstanbul\'un en ikonik yapılarından biri.',
    image: require('../../../assets/slider/ayasofya.jpg')
  },
];

export default class RecommendedPlaces extends Component {
  renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        this.props.navigation.navigate('Top-Turizm-Areas', {
          attractionId: item.id
        })
      }
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
            <Image source={require("../../../assets/global/goBack.png")} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Senin İçin Önerilen</Text>
        </View>
        <FlatList
          data={dummyRecommendedPlaces}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 16,
    marginBottom: 20,
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
});
