import { StyleSheet } from "react-native";

const colors = {
  primary: "#ffa500", // Primary color (e.g., buttons, active icons)
  secondary: "#50e3c2", // Secondary color (e.g., accents, details)
  background: "#ffffff", // Main background color
  backgroundSecondary: "#f8f8f8", // Secondary background color
  textPrimary: "#333333", // Primary text color
  textSecondary: "#666666", // Secondary text color
  border: "#cccccc", // Border color
  error: "#e74c3c", // Color for errors
  success: "#2ecc71", // Color for success messages
  blackItem: "#333333", // Pure black color
  // --- Extended tokens ---
  mapBackground: "#F0F0F0", // Light gray background for the map container
  textOnPrimary: "#FFFFFF", // White text rendered on primary-colored surfaces
  overlayBackground: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark overlay
  iconBackground: "#FFF3E0", // Very light orange tint for icon backgrounds
  // --- Aliases for legacy references (primaryText / secondaryText) ---
  primaryText: "#333333", // Alias for textPrimary
  secondaryText: "#666666", // Alias for textSecondary
};

const textSizes = {
  small: 12, 
  regular: 14, 
  medium: 16, 
  large: 18, 
  extraLarge: 26,
};

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
  },
  textPrimary: {
    fontSize: textSizes.regular,
    color: colors.textPrimary,
  },
  textSecondary: {
    fontSize: textSizes.small,
    color: colors.textSecondary,
  },
  headerText: {
    fontSize: textSizes.extraLarge, 
    color: colors.textPrimary, 
    textAlign: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: textSizes.large,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: textSizes.medium,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonText: {
    fontSize: textSizes.medium,
    color: colors.background,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Shadow for Android
  },
});

export { colors, textSizes, globalStyles };