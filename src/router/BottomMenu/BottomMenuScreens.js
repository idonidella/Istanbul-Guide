import React, { Component } from 'react';
import { StyleSheet, Image, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from '../../pages/MainScreen';
import ProfileScreen from '../../pages/Profile';
import QrScreen from '../../pages/QrScreen';

const Tab = createBottomTabNavigator();

export default class BottomMenuScreens extends Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="MainScreen"
        screenOptions={({ route }) => ({
          tabBarLabel: () => null,
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 0 : 0,
            backgroundColor: '#12101F',
            height: Platform.OS === 'ios' ? '10%' : '7.6%',
            borderTopWidth: 0,
          },
          tabBarIcon: ({ focused }) => {
            if (route.name === 'Main-Screen') {
              return (
                <View style={styles.tabIconContainer}>
                  <Image
                    resizeMode='contain'
                    // source={require('../../assets/bottomMenu/mainIcon.png')}
                    style={[
                      styles.maintabIcon,
                      focused && styles.mainTabIconContainerActive
                    ]}
                  />
                </View>
              );
            }
            if (route.name === 'Profile-Screen') {
              return (
                <View style={focused ? styles.tabIconContainerActive : styles.tabIconContainer}>
                  <Image
                    // source={require('../../assets/bottomMenu/barcode.png')}
                    style={[
                      styles.tabIcon,
                      focused && styles.activeIcon
                    ]}
                  />
                  {focused && <View style={styles.activeIndicator} />}
                </View>
              );
            }
            if (route.name === 'QR-Code') {
              return (
                <View style={focused ? styles.tabIconContainerActive : styles.tabIconContainer}>
                  <Image
                    // source={require('../../assets/bottomMenu/profilecircle.png')}
                    style={[
                      styles.tabIcon,
                      focused && styles.activeIcon
                    ]}
                  />
                  {focused && <View style={styles.activeIndicator} />}
                </View>
              );
            }
            return null;
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
    padding: 8,
  },
  tabIconContainerActive: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  maintabIcon: {
    width: 70,
    height: 70,
    borderWidth: 3,
    borderColor: '#3a5c63',
    borderRadius: 40,
    padding: 8,
    resizeMode: 'contain',
    bottom: Platform.OS === 'ios' ? 10 : 16,
  },
  mainTabIconContainerActive: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 40,
    padding: 8,
  },
  tabIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
});