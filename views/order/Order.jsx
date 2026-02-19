import React, { useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, Alert, SafeAreaView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ViewModel from "../../viewmodels/ViewModel";
import LoadingScreen from "../common/LoadingScreen";
import MapOrder from "./MapOrder";
import { colors, textSizes, globalStyles } from "../../styles/styles";

const Order = () => {
  const navigation = useNavigation();
  const interval = useRef(null); // Interval for fetching the order
  const userRef = useRef(null); // Ref so async callbacks always read the latest user
  const [menu, setMenu] = useState(null);
  const [order, setOrder] = useState(null);
  const [eta, setEta] = useState("Calculating...");

  const fetchOrder = async () => {
    try {
      const updatedOrder = await ViewModel.getOrder(userRef.current.lastOid, userRef.current.sid);
      if (updatedOrder.status === "COMPLETED") {
        Alert.alert(
          "Order completed",
          "Your order has reached the destination!",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("Home", { screen: "Homepage" }),
            },
          ]
        );
        clearInterval(interval.current);
        interval.current = null;
        const updatedUser = {
          ...userRef.current,
          lastOid: updatedOrder.oid,
          orderStatus: updatedOrder.status,
        };
        userRef.current = updatedUser;
        ViewModel.user = updatedUser;
        ViewModel.storageManager.saveUserAsync(updatedUser).catch((error) => {
          console.error("Error saving user:", error);
        });
      }
      setOrder(updatedOrder);
      if (updatedOrder.status === "ON_DELIVERY") {
        setEta(await ViewModel.getTimeRemaining(updatedOrder.expectedDeliveryTimestamp));
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const fetchDataFirst = async () => {
    try {
      const updatedUser = await ViewModel.storageManager.getUserAsync();
      // userRef keeps the latest user value accessible in async interval callbacks
      userRef.current = updatedUser;
      ViewModel.user = updatedUser;
      let fetchedOrder = {
        oid: null,
        status: null,
      };
      if (updatedUser.lastOid) {
        fetchedOrder = await ViewModel.getOrder(
          updatedUser.lastOid,
          updatedUser.sid
        );
        const fetchedMenu = await ViewModel.getMenu(
          fetchedOrder.mid,
          updatedUser.sid
        );
        setMenu(fetchedMenu);
        await ViewModel.saveUserAsync(updatedUser);
      }
      setOrder(fetchedOrder);
      if (fetchedOrder.status === "ON_DELIVERY") {
        setEta(await ViewModel.getTimeRemaining(fetchedOrder.expectedDeliveryTimestamp));
      }
      return fetchedOrder;
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("Order");
  };

  useFocusEffect(
    useCallback(() => {
      savePage();
      fetchDataFirst()
        .then((fetchedOrder) => {
          if (!fetchedOrder) {
            console.error("fetchDataFirst returned no order; skipping interval setup.");
            return;
          }
          if (fetchedOrder.status === "ON_DELIVERY") {
            interval.current = setInterval(() => {
              fetchOrder();
            }, 5000);
          }
        })
        .catch((error) => {
          console.error("Unexpected error after fetchDataFirst:", error);
        });

      return () => {
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
          ViewModel.storageManager.saveUserAsync(userRef.current).catch((error) => {
            console.error("Error saving user:", error);
          });
        }
      };
    }, [])
  );

  if (!order) {
    return <LoadingScreen />;
  }
  if (order?.oid != null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Last order #{order.oid}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Order status:</Text>
          {(() => {
            let orderStatusText = "Not provided";
            if (order.status === "ON_DELIVERY") {
              orderStatusText = "On Delivery";
            } else if (order.status === "COMPLETED") {
              orderStatusText = "Completed";
            }
            return <Text style={styles.value}>{orderStatusText}</Text>;
          })()}

          <Text style={styles.label}>Delivery:</Text>
          <Text style={styles.value}>
            {order.status === "ON_DELIVERY"
              ? ViewModel.fromTimeStampToDayAndTime(
                  order.expectedDeliveryTimestamp
                )
              : ViewModel.fromTimeStampToDayAndTime(order.deliveryTimestamp)}
          </Text>

          <Text style={styles.label}>ETA:</Text>
          <Text style={styles.value}>
            {order.status === "ON_DELIVERY"
              ? eta
              : "Order already delivered"}
          </Text>
        </View>
        <View style={styles.mapContainer}>
          {order?.deliveryLocation &&
          order?.currentPosition &&
          menu?.location ? (
            <MapOrder
              deliveryLocation={{
                latitude: order.deliveryLocation.lat,
                longitude: order.deliveryLocation.lng,
              }}
              dronePosition={{
                latitude: order.currentPosition.lat,
                longitude: order.currentPosition.lng,
              }}
              menuPosition={{
                latitude: menu.location.lat,
                longitude: menu.location.lng,
              }}
            />
          ) : (
            <Text>Map is loading...</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.containerNoOrder}>
      <Text style={styles.noOrderTitle}>No order yet</Text>
      <Text style={styles.noOrderText}>
        Go to Menu to place your first order!
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: textSizes.extraLarge,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 10,
    marginTop: 30,
  },
  card: {
    ...globalStyles.card,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: textSizes.medium,
    fontWeight: "600",
    color: colors.secondaryText,
    marginBottom: 5,
  },
  value: {
    fontSize: textSizes.large,
    color: colors.primaryText,
    marginBottom: 15,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.mapBackground,
    borderRadius: 10,
  },
  containerNoOrder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  noOrderTitle: {
    fontSize: textSizes.extraLarge,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 10,
  },
  noOrderText: {
    fontSize: textSizes.large,
    textAlign: "center",
    color: colors.secondaryText,
    marginBottom: 30,
  },
});

export default Order;
