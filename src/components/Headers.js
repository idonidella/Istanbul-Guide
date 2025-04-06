import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LogoAndTabButtons = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Image source={require("../assets/logo/logo.png")} style={{width:170, height:30,}} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileIconContainer}
          onPress={() => navigation.navigate('Profile-Screen')}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 10,
    borderRadius: 50,
    borderBottomRightRadius: 50,
  },
  logoContainer: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderRadius: 50,
  },
  logoButton: {
    paddingVertical: 5,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  profileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3d3352',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7B68EE',
    marginRight: 5,
  },
  profileIcon: {
    fontSize: 20,
    color: '#7B68EE',
  },
});

export default LogoAndTabButtons;