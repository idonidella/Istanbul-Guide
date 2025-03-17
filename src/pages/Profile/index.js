import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Switch, StatusBar, ScrollView } from 'react-native';

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
        <StatusBar barStyle="light-content" />
        
        {/* Üst profil kısmı - mor eğimli tasarım */}
        <View style={styles.headerContainer}>
          {/* Geri butonu */}
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          {/* Profil adı */}
          <Text style={styles.headerName}>Tanya Myroniuk</Text>
        </View>
        
        {/* Eğimli alt kısım için ek katman - görseldeki gibi şekilli */}
        <View style={styles.headerExtension}>
          {/* İçeriği boş, sadece şekil için */}
        </View>
        
        {/* Avatar - ortada, iki kısım arasında */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>

        {/* İçerik kısmı - beyaz arka plan üzerinde */}
        <ScrollView style={styles.contentContainer}>
          {/* Menü öğeleri */}
          <View style={styles.menuContainer}>
            {/* Profil Ayarları */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>👤</Text>
              </View>
              <Text style={styles.infoText}>Profil Ayarları</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* Dil Seçenekleri */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>🌐</Text>
              </View>
              <Text style={styles.infoText}>Dil Seçenekleri</Text>
              <View style={styles.rightContainer}>
                <View style={styles.languageBadge}>
                  <Text style={styles.languageText}>TR</Text>
                </View>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Bildirimler */}
            <View style={styles.menuItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>🔔</Text>
              </View>
              <Text style={styles.infoText}>Bildirimler</Text>
              <Switch
                value={this.state.notifications}
                onValueChange={this.toggleNotifications}
                trackColor={{ false: "#DDDDDD", true: "#9c27b0" }}
                thumbColor={"#FFFFFF"}
                style={styles.switch}
              />
            </View>

            {/* Yardım */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>❓</Text>
              </View>
              <Text style={styles.infoText}>Yardım</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* İletişim */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📧</Text>
              </View>
              <Text style={styles.infoText}>İletişim</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* Kullanım Şartları */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📝</Text>
              </View>
              <Text style={styles.infoText}>Kullanım Şartları</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          </View>
          
          {/* Çıkış Yap butonu */}
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>

          {/* Versiyon bilgisi */}
          <Text style={styles.versionText}>Versiyon 1.0.0</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Üst kısım - mor başlık, görseldeki gibi şekilli
  headerContainer: {
    height: 120,
    backgroundColor: '#9c27b0',
    paddingTop: 45,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  // Eğimli alt kenar için ilave kısım - her iki taraf da dalgalı
  headerExtension: {
    height: 50,
    backgroundColor: '#9c27b0',
    borderBottomLeftRadius: 120, // Sol taraf da eğimli
    borderBottomRightRadius: 120, // Sağ taraf eğimli
    marginLeft: -20, // Sol tarafa doğru uzatmak için
    marginRight: -20, // Sağ tarafa doğru uzatmak için
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 15,
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  // Avatar için dış beyaz konteyner
  avatarWrapper: {
    position: 'absolute',
    top: 125,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  // Avatar için iç konteyner - mor insan ikonu
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F2F2F2', // Açık gri arka plan
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#9c27b0', // Mor renk
  },
  // İçerik kısmı
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50, // Avatar için boşluk
  },
  // Menü öğeleri
  menuContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  infoIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoIcon: {
    fontSize: 16,
    color: '#9c27b0',
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#AAAAAA',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageBadge: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 10,
  },
  languageText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  // Profil düzenleme/Çıkış butonu
  editProfileButton: {
    height: 50,
    backgroundColor: '#9c27b0',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#9c27b0",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  }
});