import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native';
import store from '../../store';
import { authService } from '../../networking/api';
import { observer } from 'mobx-react';

@observer
export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: true,
      loading: true
    };
  }
  componentDidMount() {
    console.log('ProfileScreen mounted');
    console.log(store.auth.data.token);

  }

  handleLogout = async () => {
    try {
      const token = store.auth.data?.token;

      if (token) {
        await authService.signOut(token);
      }
      await store.userDeleteOrOut();
      this.props.navigation.replace('Login-Page');
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
        <View style={styles.headerContainer}></View>
        <View style={styles.headerExtension}></View>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileIconContainer}>
            <Text style={styles.profileIcon}>👤</Text>
          </View>
          <Text style={styles.headerName}>{store.auth.data.firstname} {store.auth.data.lastname}</Text>
        </View>
        <ScrollView style={styles.contentContainer} contentContainerStyle={{ paddingBottom: 200 }}>
          <View style={styles.menuContainer}>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuCardInner} onPress={() => this.props.navigation.navigate('Profile-Settings-Screen')}>
                <Text style={styles.infoIcon}>👤</Text>
                <Text style={styles.infoText}>Profil Ayarları</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuCardInner} onPress={() => this.props.navigation.navigate('Help-Page')}>
                <Text style={styles.infoIcon}>❓</Text>
                <Text style={styles.infoText}>Yardım ve Destek</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuCardInner}>
                <Text style={styles.infoIcon}>📝</Text>
                <Text style={styles.infoText}>Kullanım Şartları</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: "85%", alignSelf: 'center' }}>
            <TouchableOpacity style={styles.editProfileButton} onPress={this.handleLogout}>
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
    top: 95,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  profileIconContainer: {
    width: 70,
    height: 70,
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
    fontSize: 21,
    fontWeight: '800',
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  menuContainer: {
    marginBottom: 30,
    marginTop: 50,
    width: "85%",
    alignSelf: 'center',
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    marginBottom: 20,
    padding: 12,
  },
  menuCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  infoIcon: {
    fontSize: 20,
    color: '#7B68EE',
    marginRight: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 22,
    color: '#CCCCCC',
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
