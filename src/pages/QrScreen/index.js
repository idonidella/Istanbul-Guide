import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';

import Headers from '../../components/Headers';

export default function QRCodeVisualScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <Headers
      navigation={navigation}
      />
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
              <TouchableOpacity style={styles.generateButton}>
                <Text style={styles.generateButtonText}>Generate QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2438',
  },
  scrollContent: {
    flex:1,
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
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#3d3352',
    fontSize: 16,
    color: '#FFFFFF',
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#7B68EE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3d3352',
  },
  bottomBarButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});