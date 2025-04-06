import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Switch, StatusBar, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: true,
      username: 'Yükleniyor...',
      loading: true
    };
  }

  componentDidMount() {
    // Komponent yüklendiğinde kullanıcı bilgilerini çek
    this.getUserData();
  }

  getUserData = async () => {
    try {
      this.setState({ loading: true });
      
      // AsyncStorage'dan kullanıcı bilgilerini çek
      const userDataJson = await AsyncStorage.getItem('userData');
      
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        this.setState({ 
          username: userData.username || 'Kullanıcı',
          loading: false
        });
      } else {
        // Kullanıcı verisi bulunamadı
        this.setState({
          username: 'Kullanıcı',
          loading: false
        });
        console.log('Kullanıcı bilgileri bulunamadı');
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata oluştu:', error);
      this.setState({ 
        username: 'Kullanıcı',
        loading: false
      });
    }
  };

  handleLogout = async () => {
    try {
      // AsyncStorage'dan token ve kullanıcı bilgilerini sil
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      // Login sayfasına yönlendir
      this.props.navigation.navigate('Login-Page');
    } catch (error) {
      console.error('Çıkış yaparken hata oluştu:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu');
    }
  };

  toggleNotifications = () => {
    this.setState(prevState => ({
      notifications: !prevState.notifications
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2A2438" />
        <View style={styles.headerContainer}>
          {/* Üst kısımda herhangi bir içerik yok */}
        </View>

        {/* Eğimli alt kısım için ek katman - görseldeki gibi şekilli */}
        <View style={styles.headerExtension}>
          {/* İçeriği boş, sadece şekil için */}
        </View>

        {/* Profil ikonu ve isim, renk geçişinde */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileIconContainer}>
            <Text style={styles.profileIcon}>👤</Text>
          </View>
          {this.state.loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.headerName}>{this.state.username}</Text>
          )}
        </View>

        <ScrollView style={styles.contentContainer} contentContainerStyle={{ paddingBottom: 200 }}>
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
                trackColor={{ false: "#3A3A3A", true: "#7B68EE" }}
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

          <View style={{width: "88%", alignSelf: 'center'}}>
            <TouchableOpacity 
              style={styles.editProfileButton} 
              onPress={this.handleLogout}
            >
              <Text style={styles.editProfileButtonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2438',
  },

  headerContainer: {
    height: 100,
    backgroundColor: '#7B68EE',
  },

  headerExtension: {
    height: 50,
    backgroundColor: '#7B68EE',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    marginLeft: -10,
    marginRight: -10,
  },

  profileInfoContainer: {
    position: 'absolute',
    top: 110,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },

  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3d3352',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#7B68EE',
  },

  profileIcon: {
    fontSize: 24,
    color: '#7B68EE',
  },

  headerName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },

  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  menuContainer: {
    marginBottom: 30,
    marginTop: 30,
    width: "85%",
    alignSelf: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3352',
  },
  infoIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  infoIcon: {
    fontSize: 16,
    color: '#7B68EE',
  },
  infoText: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#777777',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageBadge: {
    backgroundColor: '#3d3352',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 10,
  },
  languageText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  editProfileButton: {
    height: 50,
    backgroundColor: '#7B68EE',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 30,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});