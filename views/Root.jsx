/* eslint-disable react/prop-types */
import React from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./menu/Home";
import Menu from "./menu/Menu";
import ConfirmOrder from "./menu/ConfirmOrder";
import ProfilePage from "./profile/ProfilePage";
import Order from "./order/Order";
import Form from "./profile/Form";
import ViewModel from "../viewmodels/ViewModel";
import Ingredients from "./menu/Ingredients";
import { colors } from "../styles/styles";

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function HomeScreenStack({ route }) {
  const { user, initialRouteName } = route.params;
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <HomeStack.Screen
        name="Homepage"
        component={HomeScreen}
        initialParams={{ user }}
      />
      <HomeStack.Screen name="Menu" component={Menu} />
      <HomeStack.Screen
        name="ConfirmOrder"
        component={ConfirmOrder}
        options={{ headerShown: true, headerTitle: "Review your order" }}
      />
      <HomeStack.Screen
        name="Ingredients"
        component={Ingredients}
        options={{ headerShown: true, headerTitle: "Ingredients" }}
      />
    </HomeStack.Navigator>
  );
}

function ProfileScreenStack({ route }) {
  const { user, initialRouteName } = route.params;
  return (
    <ProfileStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <ProfileStack.Screen
        name="ProfilePage"
        component={ProfilePage}
        initialParams={{ user: user }}
      />
      <ProfileStack.Screen name="Form" component={Form} />
    </ProfileStack.Navigator>
  );
}

const getTabBarIcon = (route, focused, size) => {
  let iconSource;

  if (route.name === "Home") {
    iconSource = require("../assets/icons/menu.png");
  } else if (route.name === "Order") {
    iconSource = require("../assets/icons/shopping_bag.png");
  } else if (route.name === "Profile") {
    iconSource = require("../assets/icons/user.png");
  }

  return (
    <Image
      source={iconSource}
      style={{
        width: size,
        height: size,
        tintColor: focused ? colors.primary : "gray",
      }}
    />
  );
};

const Root = ({ user, lastScreen = "Homepage" }) => {
  const initialRouteNames = ViewModel.getInitialRouteNames(lastScreen);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={initialRouteNames.get("Root")}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused, size }) =>
            getTabBarIcon(route, focused, size),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreenStack}
          initialParams={{
            user: user,
            initialRouteName: initialRouteNames.get("Home"),
          }}
          options={{ popToTopOnBlur: true, tabBarLabel: "Menu" }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Home", { screen: "Homepage" });
            },
          })}
        />
        <Tab.Screen name="Order" component={Order} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreenStack}
          initialParams={{
            user: user,
            initialRouteName: initialRouteNames.get("Profile"),
          }}
          options={{ popToTopOnBlur: true }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Profile", { screen: "ProfilePage" });
            },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Root;
