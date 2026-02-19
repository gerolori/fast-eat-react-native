/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ViewModel from "../../viewmodels/ViewModel";
import LoadingScreen from "../common/LoadingScreen";
import { globalStyles, colors, textSizes } from "../../styles/styles";

const ConfirmOrder = ({ navigation }) => {
  const [lastMenu, setLastMenu] = useState(null);
  const [user, setUser] = useState(null);
  const [locationCoords, setLocationCoords] = useState(null);

  const [address, setAddress] = useState(null);

  const fetchData = async () => {
    try {
      const coords = ViewModel.getLocationCoords();
      setLocationCoords(coords);
      await ViewModel.saveLastScreenAsync("ConfirmOrder");
      const address = await ViewModel.getAddress();
      setAddress(address.formattedAddress);
    } catch {
      setAddress("Location unavailable");
    }
    const fetchedUser = await ViewModel.getUserFromAsyncStorage();
    setUser(fetchedUser);
    setLastMenu(await ViewModel.getLastMenu());
    ViewModel.user = fetchedUser;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmOrder = async () => {
    try {
      const order = await ViewModel.confirmOrder(
        lastMenu,
        user,
        locationCoords
      );
      if (order === undefined) {
        return;
      }
      navigation.navigate("Order");
    } catch (error) {
      if (error.status === 409) {
        Alert.alert(
          "You cannot order now, you already have an active order!",
          "",
          [{ text: "OK" }],
          { cancelable: true }
        );
        return;
      }

      const httpStatusMatch = error.message?.match(/HTTP status: (\d+)/);
      const httpStatus = httpStatusMatch ? parseInt(httpStatusMatch[1], 10) : null;
      const isPaymentError = httpStatus === 402;

      if (isPaymentError) {
        Alert.alert("Invalid card!", "", [{ text: "OK" }], { cancelable: true });
      } else {
        Alert.alert(
          "Something went wrong. Please try again.",
          "",
          [{ text: "OK" }],
          { cancelable: true }
        );
      }
    }
  };

  if (!user || !lastMenu) {
    return <LoadingScreen />;
  }

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {user.firstName} {user.lastName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Menu:</Text>
          <Text style={styles.value}>{lastMenu.name}</Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.navigate("Menu")}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>
            {" "}
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.buttonText}> Confirm order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmOrder;

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: textSizes.extraLarge,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.textPrimary,
  },
  card: {
    ...globalStyles.card,
    marginBottom: 20,
  },
  infoRow: {
    fontSize: textSizes.medium,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  button: {
    ...globalStyles.button,
    backgroundColor: colors.primary,
    padding: 15,
    margin: 10,
  },
  cancelButton: {
    backgroundColor: colors.backgroundSecondary,
  },
  cancelButtonText: {
    color: colors.textSecondary,
  },
  buttonText: {
    fontSize: textSizes.medium,
    color: colors.background,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
});
