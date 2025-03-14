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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BOSS.AI</Text>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Hello, James</Text>
            <Text style={styles.accountText}>Personal account</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TP</Text>
          </View>
        </View>

        {/* Content Container with shadow */}
        <View style={styles.contentContainer}>
          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>TM</Text>
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>Tanya Myroniuk</Text>
              <Text style={styles.profileTitle}>Senior Designer</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {/* Profile Settings */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.iconCircle, {backgroundColor: '#E8F1FF'}]}>
                <Text style={[styles.iconText, {color: '#3D7CFF'}]}>👤</Text>
              </View>
              <Text style={styles.menuText}>Profil Ayarları</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
            
            {/* Language Options */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.iconCircle, {backgroundColor: '#E8FFF1'}]}>
                <Text style={[styles.iconText, {color: '#34C759'}]}>🌐</Text>
              </View>
              <Text style={styles.menuText}>Dil Seçenekleri</Text>
              <View style={styles.languageContainer}>
                <Text style={styles.languageText}>TR</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Notifications */}
            <View style={styles.menuItem}>
              <View style={[styles.iconCircle, {backgroundColor: '#FFE8E8'}]}>
                <Text style={[styles.iconText, {color: '#FF3B30'}]}>🔔</Text>
              </View>
              <Text style={styles.menuText}>Bildirimler</Text>
              <Switch
                value={this.state.notifications}
                onValueChange={this.toggleNotifications}
                trackColor={{ false: "#D1D1D6", true: "#34C759" }}
                thumbColor={"#FFFFFF"}
                style={styles.switch}
              />
            </View>

            {/* Help */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.iconCircle, {backgroundColor: '#E8F8FF'}]}>
                <Text style={[styles.iconText, {color: '#32ADE6'}]}>❓</Text>
              </View>
              <Text style={styles.menuText}>Yardım</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    backgroundColor: '#3D7CFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  userInfo: {
    flex: 3,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  accountText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#3D7CFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginTop: -15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#50B4F2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileImageText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileTextContainer: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    color: '#000',
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#8E8E93',
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
    color: '#8E8E93',
    marginRight: 5,
    fontWeight: '500',
  },
});