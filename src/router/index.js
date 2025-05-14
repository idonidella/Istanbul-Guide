import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// NAVIGATOR
const Stack = createNativeStackNavigator();
// auths pages
import SplashScreen from "../pages/SplashScreen/index";
import LoginPage from "../pages/Auth/Login/index";
import RegisterPage from "../pages/Auth/Register/index";
// main pages
import BottomMenuScreens from "./BottomMenu/BottomMenuScreens";
import TopTurizmAreas from "../pages/Main/TopTurizmAreas/index";
import VisitedPlace from "../pages/Main/VisitedPlace/index";
import RecommendedPlaces from "../pages/Main/Recommend/index";
import Favorites from "../pages/Main/Favorites/index";
//profile
import ProfileSettingsScreen from "../pages/Profile/ProfileSettingsScreen";
import HelpPage from "../pages/Profile/HelpPage";



export default class MenuScreens extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash-Screen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Splash-Screen"
            component={SplashScreen}
            key="Splash-Screen"
          />
          <Stack.Screen
            name="Login-Page"
            component={LoginPage}
            key="Main-Screen"
          />
          <Stack.Screen
            name="Register-Page"
            component={RegisterPage}
            key="Register-Page"
          />
          <Stack.Screen
            name="Main"
            component={BottomMenuScreens}
            key="Login-Page"
          />
          <Stack.Screen
            name="Top-Turizm-Areas"
            component={TopTurizmAreas}
            key="Top-Turizm-Areas"
          />
          <Stack.Screen
            name="Visited-Place"
            component={VisitedPlace}
            key="VisitedPlace"
          />
          <Stack.Screen
            name="Recommended-Places"
            component={RecommendedPlaces}
            key="RecommendedPlaces"
          />
          <Stack.Screen
            name="Help-Page"
            component={HelpPage}
            key="Help-Page"
          />
          <Stack.Screen
            name="Favorites-Screen"
            component={Favorites}
            key="Favorites"
          />
          <Stack.Screen
            name="Profile-Settings-Screen"
            component={ProfileSettingsScreen}
            key="Profile-Settings-Screen"
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
