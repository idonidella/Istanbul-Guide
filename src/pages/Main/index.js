import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions } from 'react-native';

export default class TaxiBookingScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* Harita Görüntüsü (şimdilik koyu arka plan) */}
        <View style={[styles.mapContainer, {backgroundColor: '#272727'}]}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Rezervasyon Kartı */}
        <View style={styles.bookingCard}>
          <Text style={styles.cardTitle}>Where can we take you ?</Text>
          <Text style={styles.cardSubtitle}>Book a trusted local taxi for your trip</Text>
          
          {/* Konum Girişi */}
          <View style={styles.locationInputContainer}>
            <View style={styles.radioInputRow}>
              <TouchableOpacity style={styles.radioButton} />
              <TextInput
                style={styles.input}
                placeholder="Enter Pickup location"
                placeholderTextColor="#777"
              />
            </View>
            
            <View style={styles.radioInputRow}>
              <TouchableOpacity style={styles.radioButton} />
              <TextInput
                style={styles.input}
                placeholder="Enter destination"
                placeholderTextColor="#777"
              />
            </View>
            
            <View style={styles.timeInputRow}>
              <Text style={styles.clockIcon}>⏱️</Text>
              <Text style={styles.timeText}>Tell us when</Text>
              <View style={styles.timeUnderline}></View>
            </View>
          </View>
          
          {/* Fiyatları Görüntüle Butonu */}
          <TouchableOpacity style={styles.pricesButton}>
            <Text style={styles.pricesButtonText}>See prices</Text>
          </TouchableOpacity>
        </View>
        
        {/* Alt Menü Barı */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarButton}>
            <Text style={styles.bottomBarIcon}>♥️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bottomBarButton}>
            <Text style={styles.bottomBarIcon}>🔍</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bottomBarButton}>
            <Text style={styles.bottomBarIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F1F', // Koyu arka plan
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#272727', // Koyu arka plan
    borderRadius: 50,
    padding: 8,
    zIndex: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: 'white', // Beyaz metin
  },
  bookingCard: {
    backgroundColor: '#272727', // Koyu arka plan
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF', // Beyaz metin
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#AAAAAA', // Açık gri metin
    marginBottom: 25,
  },
  locationInputContainer: {
    marginBottom: 25,
  },
  radioInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#8A56FF', // Mor çerçeve
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#333333', // Koyu çizgi
    fontSize: 16,
    color: '#FFFFFF', // Beyaz metin
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333', // Koyu çizgi
  },
  clockIcon: {
    fontSize: 20,
    color: '#8A56FF', // Mor ikon
  },
  timeText: {
    fontSize: 16,
    color: '#AAAAAA', // Açık gri metin
    marginLeft: 10,
  },
  timeUnderline: {
    flex: 1,
  },
  pricesButton: {
    backgroundColor: '#8A56FF', // Mor buton
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  pricesButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#6236FF', // Koyu mor
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarIcon: {
    fontSize: 24,
    color: 'white',
  },
});