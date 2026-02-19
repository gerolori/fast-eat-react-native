/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import ViewModel from "../../viewmodels/ViewModel";
import MenusList from "./MenusList";
import { colors, textSizes } from "../../styles/styles";

import { SafeAreaView } from "react-native-safe-area-context";

import LoadingScreen from "../common/LoadingScreen";

const Home = ({ route }) => {
  const user = route.params.user || ViewModel.user;
  const [address, setAddress] = useState(null);
  const [menus, setMenus] = useState(null);
  const [changed, setChanged] = useState(false);

  const initHome = async () => {
    try {
      await ViewModel.saveLastScreenAsync("Home");
      const menu = await ViewModel.getMenus(user.sid);
      setMenus(menu);
      const fetchedAddress = await ViewModel.getAddress();
      setAddress(fetchedAddress);
    } catch (error) {
      console.error("Error while loading menus:", error);
    }
  };

  useEffect(() => {
    initHome();
  }, [changed]);

  if (menus === null) {
    return <LoadingScreen />;
  }
  return (
    <SafeAreaView style={styles.container}>
      {address && (
        <View style={styles.address}>
          <Text style={styles.addressText}>
            {address.street
              ? address.street
              : address.formattedAddress || "Address not available"}
          </Text>
          <Text style={styles.cityText}>
            {address.city || "City not available"}
          </Text>
        </View>
      )}
      <MenusList menus={menus} user={user} setChanged={setChanged} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  address: {
    padding: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressText: {
    fontSize: textSizes.medium,
    color: colors.textPrimary,
  },
  cityText: {
    fontSize: textSizes.small,
    color: colors.textSecondary,
  },
});

export default Home;
