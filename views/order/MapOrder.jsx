/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles/styles";

const MapOrder = ({ deliveryLocation, dronePosition, menuPosition }) => {
  // State for the map region, initialized with the drone's position
  const [region, setRegion] = useState({
    latitude: dronePosition.latitude,
    longitude: dronePosition.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Update the map region when the drone's position changes
  useEffect(() => {
    setRegion({
      latitude: dronePosition.latitude,
      longitude: dronePosition.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [dronePosition]); // Perform the update whenever the drone's position changes

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={false}
        zoomEnabled={true}
        region={region} // Use the updated region
      >
        {/* Draw a marker for the drone's position if the drone and delivery positions are different */}
        {dronePosition?.latitude !== deliveryLocation?.latitude ||
        dronePosition?.longitude !== deliveryLocation?.longitude ? (
          <Marker coordinate={dronePosition} title="Drone Position">
            <Image
              source={require("../../assets/icons/drone.png")}
              style={styles.mapIcon}
            />
          </Marker>
        ) : null}

        {/* Draw a marker for the menu position if the drone and menu positions are different */}
        {dronePosition?.latitude !== menuPosition?.latitude ||
        dronePosition?.longitude !== menuPosition?.longitude ? (
          <Marker coordinate={menuPosition} title={"Menu Position"}>
            <Image
              source={require("../../assets/icons/shopping_bag.png")}
              style={styles.mapIcon}
            />
          </Marker>
        ) : null}

        {/* Draw a marker for the delivery location */}
        <Marker coordinate={deliveryLocation} title={"Delivery Position"}>
          <Image
            source={require("../../assets/icons/home.png")}
            style={styles.mapIcon}
          />
        </Marker>

        {/* Draw a line between the menu position and the delivery location */}
        <Polyline
          coordinates={[menuPosition, deliveryLocation]}
          strokeColor={colors.primary} // Use the primary color defined in styles.js
          strokeWidth={2}
        />
      </MapView>
    </SafeAreaView>
  );
};

export default MapOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapIcon: {
    width: 30,
    height: 30,
  },
});
