import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";
import ViewModel from "./viewmodels/ViewModel";
import FirstComponent from "./views/onboarding/FirstComponent";

import LoadingScreen from "./views/common/LoadingScreen";
import Root from "./views/Root";


export default function App() {
  const [firstRun, setFirstRun] = useState(null);
  const [location, setLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [changed, setChanged] = useState(false);
  const [lastScreen, setLastScreen] = useState(null);

  useEffect(() => {
    ViewModel.initApp()
      .then((res) => {
        setFirstRun(res.firstRun);
        setUser(res.user);
        setLocation(res.location);
        setLastScreen(res.lastScreen);
      })
      .catch((error) => {
        console.error("Failed to initialize app:", error);
        setFirstRun(false);
        Alert.alert(
          "Startup Error",
          "Something went wrong while loading the app. Please restart and try again."
        );
      });
  }, [changed]);

  const handleChangePress = () => {
    setChanged(!changed);
  };

  if (firstRun) {
    return (
      <View style={styles.container}>
        <FirstComponent setChanged={setChanged} setUser={setUser} />
      </View>
    );
  }

  if (firstRun === false) {
    if (user !== null && location !== null) {
      return <Root user={user} lastScreen={lastScreen} />;
    } else {
      // Location permission not yet granted — prompt user to enable it
      return (
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.text}>
              To provide our service, we need access to your location.{"\n"}
              Please grant location permission.
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleChangePress}
                title="Done!"
                color="#4caf50"
              >
              </Button>
            </View>
          </View>
        </View>
      );
    }
  }

  return <LoadingScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  box: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    elevation: 5,
  },
});
