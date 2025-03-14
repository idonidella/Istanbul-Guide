import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Switch, SafeAreaView, ScrollView, StatusBar } from 'react-native';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: true
    };
  }

  toggleNotifications = () => {
    this.setState(prevState => ({
      notifications: !prevState.notifications
    }));
  }

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.container}>
            {/* Header with profile info */}
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <Text style={styles.profileImageText}>TM</Text>
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>Tanya Myroniuk</Text>
                <Text style={styles.profileTitle}>Senior Designer</Text>
              </View>
            </View>

            {/* Settings Section */}
            <View style={styles.sectionContainer}>
              {/* Profile Settings */}
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 126, 95, 0.2)'}]}>
                  <Text style={[styles.iconText, {color: '#ff7e5f'}]}>👤</Text>
                </View>
                <Text style={styles.menuText}>Profil Ayarları</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
              
              {/* Language Settings */}
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 126, 95, 0.2)'}]}>
                  <Text style={[styles.iconText, {color: '#ff7e5f'}]}>🌐</Text>
                </View>
                <Text style={styles.menuText}>Dil Seçenekleri</Text>
                <View style={styles.languageContainer}>
                  <Text style={styles.languageText}>TR</Text>
                  <Text style={styles.arrowIcon}>›</Text>
                </View>
              </TouchableOpacity>
              
              {/* Notifications */}
              <View style={styles.menuItem}>
                <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 126, 95, 0.2)'}]}>
                  <Text style={[styles.iconText, {color: '#ff7e5f'}]}>🔔</Text>
                </View>
                <Text style={styles.menuText}>Bildirimler</Text>
                <Switch
                  value={this.state.notifications}
                  onValueChange={this.toggleNotifications}
                  trackColor={{ false: "rgba(50, 50, 50, 0.8)", true: "#ff7e5f" }}
                  thumbColor={"#fff"}
                  style={styles.switch}
                />
              </View>
            </View>
            
            {/* Help Section */}
            <View style={styles.sectionContainer}>
              {/* Help */}
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 126, 95, 0.2)'}]}>
                  <Text style={[styles.iconText, {color: '#ff7e5f'}]}>❓</Text>
                </View>
                <Text style={styles.menuText}>Yardım</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
              
              {/* Contact */}
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 126, 95, 0.2)'}]}>
                  <Text style={[styles.iconText, {color: '#ff7e5f'}]}>✉️</Text>
                </View>
                <Text style={styles.menuText}>İletişim</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
              
              {/* Terms and Privacy */}
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 126, 95, 0.2)'}]}>
                  <Text style={[styles.iconText, {color: '#ff7e5f'}]}>📝</Text>
                </View>
                <Text style={styles.menuText}>Kullanım Şartları</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            </View>
            
            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
            </TouchableOpacity>
            
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Versiyon 1.0.0</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff7e5f',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileImageText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  profileTextContainer: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
  },
  profileTitle: {
    fontSize: 16,
    color: '#f5f5f5',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#ff7e5f',
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 18,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#ff7e5f',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    color: '#f5f5f5',
    marginRight: 5,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 126, 95, 0.2)',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ff7e5f',
  },
  logoutButtonText: {
    color: '#ff7e5f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  }
});