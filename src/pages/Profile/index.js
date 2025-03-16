import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Switch } from 'react-native';

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
      <View style={styles.container}>
        {/* Üst profil kısmı */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>TM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Tanya Myroniuk</Text>
            <Text style={styles.profileTitle}>Senior Designer</Text>
          </View>
        </View>

        {/* Menü öğeleri */}
        <View style={styles.menuContainer}>
          {/* Profil Ayarları */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconCircle, {backgroundColor: '#7B68EE40'}]}>
              <Text style={styles.menuIconText}>👤</Text>
            </View>
            <Text style={styles.menuText}>Profil Ayarları</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Dil Seçenekleri */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconCircle, {backgroundColor: '#7B68EE40'}]}>
              <Text style={styles.menuIconText}>🌐</Text>
            </View>
            <Text style={styles.menuText}>Dil Seçenekleri</Text>
            <View style={styles.languageContainer}>
              <Text style={styles.languageText}>TR</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Bildirimler */}
          <View style={styles.menuItem}>
            <View style={[styles.menuIconCircle, {backgroundColor: '#7B68EE40'}]}>
              <Text style={styles.menuIconText}>🔔</Text>
            </View>
            <Text style={styles.menuText}>Bildirimler</Text>
            <Switch
              value={this.state.notifications}
              onValueChange={this.toggleNotifications}
              trackColor={{ false: "#D1D1D6", true: "#7B68EE" }}
              thumbColor={"#FFFFFF"}
              style={styles.switch}
            />
          </View>

          {/* Yardım */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconCircle, {backgroundColor: '#7B68EE40'}]}>
              <Text style={styles.menuIconText}>❓</Text>
            </View>
            <Text style={styles.menuText}>Yardım</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* İletişim */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconCircle, {backgroundColor: '#7B68EE40'}]}>
              <Text style={styles.menuIconText}>📧</Text>
            </View>
            <Text style={styles.menuText}>İletişim</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Kullanım Şartları */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconCircle, {backgroundColor: '#7B68EE40'}]}>
              <Text style={styles.menuIconText}>📝</Text>
            </View>
            <Text style={styles.menuText}>Kullanım Şartları</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Çıkış Yap butonu */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>

        {/* Versiyon bilgisi */}
        <Text style={styles.versionText}>Versiyon 1.0.0</Text>

        {/* Alt Menü */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarButton}>
            <Text style={styles.bottomBarIconText}>📱</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bottomBarButton}>
            <Text style={styles.bottomBarIconText}>🔍</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.bottomBarButton, styles.activeBottomBarButton]}>
            <Text style={styles.bottomBarIconText}>👤</Text>
            <View style={styles.activeIndicator} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F1F', // Koyu arka plan
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF7F50', // Koyu turuncu avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileTitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 4,
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#2D2D2D', // Menü öğesi arka planı
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 18,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#AAAAAA',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginRight: 8,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  logoutButton: {
    backgroundColor: '#7B68EE', // Mor çıkış butonu
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 60,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#2D2D2D',
    borderRadius: 30,
    height: 60,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomBarButton: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  activeBottomBarButton: {
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#7B68EE', // Mor aktif gösterge
  },
  bottomBarIconText: {
    fontSize: 24,
  },
});