import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, Image, ScrollView } from 'react-native';
import Headers from '../../components/Headers';

export default class TaxiBookingScreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.safeArea} contentContainerStyle={{paddingBottom: 100}}> 
          {/* <Headers/> */}
          <View style={styles.container}>
            <View>
              <Image
                source={require('../../assets/main/map.jpeg')}
                style={styles.mapImage}
              />
            </View>
            <View style={styles.bookingCard}>
              <Text style={styles.cardTitle}>Where can we take you ?</Text>
              <Text style={styles.cardSubtitle}>Book a trusted local taxi for your trip</Text>
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
              <TouchableOpacity style={styles.pricesButton}>
                <Text style={styles.pricesButtonText}>See prices</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#2A2438', 
  },
  mapImage: {
    width: "100%",
  },
  bookingCard: {
    backgroundColor: '#382e48', 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
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
    borderColor: '#7B68EE', 
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3352',
    fontSize: 16,
    color: '#FFFFFF', 
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3352', 
  },
  clockIcon: {
    fontSize: 20,
    color: '#7B68EE', 
  },
  timeText: {
    fontSize: 16,
    color: '#AAAAAA', 
    marginLeft: 10,
  },
  timeUnderline: {
    flex: 1,
  },
  pricesButton: {
    backgroundColor: '#7B68EE', 
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
});