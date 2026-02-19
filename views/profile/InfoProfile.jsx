/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import ViewModel from "../../viewmodels/ViewModel";
import LoadingScreen from "../common/LoadingScreen";
import { globalStyles, textSizes, colors } from "../../styles/styles";
import { SafeAreaView } from "react-native-safe-area-context";

const InfoProfile = () => {
  const [user, setUser] = useState(ViewModel.user);
  const [order, setOrder] = useState(null);
  const [menu, setMenu] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // re-fetches data whenever the tab regains focus

  const fetchUser = async () => {
    try {
      const res = await ViewModel.storageManager.getUserAsync();
      let order = null;
      let menu = null;
      if (res.lastOid != null) {
        order = await ViewModel.getOrder(res.lastOid, res.sid);
        menu = await ViewModel.getMenu(order.mid, res.sid);
      }
      setUser(res);
      setMenu(menu);
      setOrder(order);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isFocused]);

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.headerName}>Welcome, {user.firstName}!</Text>

        <View style={styles.content}>
          <InfoSection title="Personal Information">
            <InfoItem
              icon="person"
              label="First Name"
              value={user.firstName || "Unknown"}
            />
            <InfoItem
              icon="people"
              label="Last Name"
              value={user.lastName || "Unknown"}
            />
          </InfoSection>

          <InfoSection title="Payment Information">
            <InfoItem
              icon="card"
              label="Cardholder Name"
              value={user.cardFullName || "Unknown"}
            />
            <InfoItem
              icon="card"
              label="Card Number"
              value={
                user.cardNumber
                  ? `**** **** **** ${user.cardNumber.slice(-4)}`
                  : "Unknown"
              }
            />
            <InfoItem
              icon="calendar"
              label="Expiration Date"
              value={
                user.cardExpireMonth && user.cardExpireYear
                  ? `${user.cardExpireMonth
                      .toString()
                      .padStart(2, "0")}/${user.cardExpireYear
                      .toString()
                      .slice(-2)}`
                  : "Unknown"
              }
            />
          </InfoSection>
          {order && menu ? (
            <InfoSection title="Order Information">
              <InfoItem
                icon="restaurant"
                label="Last Order"
                value={menu.name || "No orders"}
              />
              <InfoItem
                icon="information-circle"
                label="Order Status"
                value={(() => {
                  if (order.status === "ON_DELIVERY") return "On Delivery";
                  if (order.status === "COMPLETED") return "Delivered";
                  return "Not provided";
                })()}
              />
            </InfoSection>
          ) : null}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("Form", { before: "ProfilePage" })
            }
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoItemLeft}>
      <Ionicons
        name={icon}
        size={20}
        color={colors.primary}
        style={styles.infoItemIcon}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerName: {
    fontSize: textSizes.extraLarge,
    color: "black",
    textAlign: "center",
    padding: 20,
  },
  content: {
    padding: 20,
  },
  section: {
    ...globalStyles.card,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: textSizes.large,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.textPrimary,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  infoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoItemIcon: {
    marginRight: 10,
  },
  label: {
    fontSize: textSizes.medium,
    color: colors.textSecondary,
  },
  value: {
    fontSize: textSizes.medium,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  editButton: {
    ...globalStyles.button,
    marginTop: 20,
  },
  editButtonText: {
    ...globalStyles.buttonText,
  },
});

export default InfoProfile;
