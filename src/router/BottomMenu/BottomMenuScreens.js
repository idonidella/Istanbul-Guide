import React, { Component } from 'react';
import { StyleSheet, Image, View, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

// Pages
import MainScreen from '../../pages/Main';
import ProfileScreen from '../../pages/Profile';
import QrScreen from '../../pages/QrScreen';

export default class BottomMenuScreens extends Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Main-Screen"
        screenOptions={({ route }) => ({
          tabBarLabel: () => null,
          tabBarStyle: {
            position: 'absolute',
            bottom: 10,
            backgroundColor: '#07090e',
            height: Platform.OS === 'ios' ? 90 : 80,
            borderRadius: 20,
            paddingTop: 10,
          },

          tabBarIcon: ({ focused }) => {
            let icon;
            if (route.name === 'Main-Screen') {
              icon = require('../../assets/bottomMenu/barcode.png');
            }
            if (route.name === 'QR-Code') {
              icon = require('../../assets/bottomMenu/qrIcon.png');
            }
            if (route.name === 'Profile-Screen') {
              icon = require('../../assets/bottomMenu/profilecircle.png');
            }
            return (
              <View style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive
              ]}>
                <Image
                  source={icon}
                  style={focused ? styles.tabIconActive : styles.tabIcon}
                  resizeMode='contain'
                />
                {focused && <View style={styles.activeIndicator} />}
              </View>
            );
          },
        })}
      >
        <Tab.Screen
          name="QR-Code"
          options={{ unmountOnBlur: false, headerShown: false }}
          component={QrScreen}
          key="qr-screen"
        />
        <Tab.Screen
          name="Main-Screen"
          options={{ unmountOnBlur: false, headerShown: false }}
          component={MainScreen}
          key="main-screen"
        />
        <Tab.Screen
          name="Profile-Screen"
          options={{ unmountOnBlur: false, headerShown: false }}
          component={ProfileScreen}
          key="profile-screen"
        />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    padding: 8,
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 8,
  },
  tabIcon: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
  },
  tabIconActive: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  }
});