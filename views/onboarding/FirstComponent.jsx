import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import ViewModel from "../../viewmodels/ViewModel";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../common/LoadingScreen";
import { globalStyles, colors, textSizes } from "../../styles/styles";

// FirstComponent is the component displayed when the app starts, asking the user to share their location
// Passes setUser and setChanged as props to update the app's state
const FirstComponent = ({ setChanged, setUser }) => {
  const [screen, setScreen] = useState("FirstScreen");
  // Function to handle the "Continue" button
  const onSubmit = async () => {
    // Sets user with the user's data; if the user doesn't exist, it creates and saves it in async storage
    const user = await ViewModel.getUserFromAsyncStorage();
    setUser(user);
    // Calculates the current location and saves it in location if permissions are granted
    await ViewModel.positionController.getLocationAsync();
    // Initializes setChanged to true when "Continue" is pressed on the second screen
    setChanged(true);
  };

  // If screen is FirstScreen, display the initial logo with the "Start" button
  // When the button is pressed, set screen to SecondScreen
  if (screen === "FirstScreen") {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../../assets/logo/splash_logo.png")}
          style={styles.background}
          resizeMode="contain"
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setScreen("SecondScreen")}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  // If screen is SecondScreen, display the title "Share your location" and the "Continue" button
  // When the button is pressed, call the onSubmit function to set user and location, and set changed to true
  else if (screen === "SecondScreen") {
    return (
      <SafeAreaView style={styles.containerSecond}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.titleSecond}>Share your location</Text>
            <Text style={styles.subtitle}>
              You will see the best restaurants menus near you
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buttonSecond}
          onPress={async () => {
            await onSubmit();
          }}
        >
          <Text style={styles.buttonTextSecond}>Enable Location</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // If screen is neither FirstScreen nor SecondScreen, display the loading component
  return <LoadingScreen />;
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    height: "100%",
    width: "100%",
  },
  background: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  titleContainer: {
    backgroundColor: colors.overlayBackground,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  title: {
    color: colors.textOnPrimary,
    fontSize: textSizes.extraLarge,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    ...globalStyles.button,
    position: "absolute",
    bottom: 40,
    width: 350,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginBottom: 40,
  },
  buttonText: {
    color: colors.background,
    fontSize: textSizes.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
  containerSecond: {
    ...globalStyles.container,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: textSizes.medium,
    fontWeight: "600",
    textAlign: "center",
    marginRight: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  titleSecond: {
    fontSize: textSizes.extraLarge,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: textSizes.large,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonSecond: {
    ...globalStyles.button,
    backgroundColor: colors.primary,
    marginHorizontal: 24,
    marginBottom: 90,
    paddingVertical: 16,
  },
  buttonTextSecond: {
    color: colors.background,
    fontSize: textSizes.medium,
    fontWeight: "bold",
  },
});
FirstComponent.propTypes = {
  setChanged: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default FirstComponent;
