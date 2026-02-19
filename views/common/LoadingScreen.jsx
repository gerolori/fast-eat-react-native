import React from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { globalStyles, colors } from "../../styles/styles.js";

const LoadingScreen = () => {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <Image
        source={require("../../assets/logo/logo.png")}
        style={styles.image}
      />
      <ActivityIndicator size="large" color={colors.blackItem} />
    </View>
  );
};

export default LoadingScreen;

const styles = {
  container: {
    ...globalStyles.container,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
};
