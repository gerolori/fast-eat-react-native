/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, colors, textSizes } from "../../styles/styles";
import CommunicationController from "../../models/CommunicationController";
import ViewModel from "../../viewmodels/ViewModel";

const Form = ({ route }) => {
  const { before } =
    route.params != null ? route.params : { before: "ProfilePage" };
  const user = ViewModel.user; // Reintroduced the use of user
  const navigation = useNavigation();

  const [newUser, setNewUser] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    cardFullName: user.cardFullName || "",
    cardNumber: user.cardNumber || "",
    cardExpireMonth: user.cardExpireMonth ? String(user.cardExpireMonth) : "",
    cardExpireYear: user.cardExpireYear ? String(user.cardExpireYear) : "",
    cardCVV: user.cardCVV || "",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    cardFullName: false,
    cardNumber: false,
    cardExpireMonth: false,
    cardExpireYear: false,
    cardCVV: false,
  });

  const handleInputChange = (field, value) => {
    setNewUser((prevObj) => ({ ...prevObj, [field]: value }));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let isValid = true;

    switch (field) {
      case "firstName":
      case "lastName":
      case "cardFullName": {
        const nameRegex = /^[a-zA-Z\s]+$/;
        isValid = value.length <= 15 && nameRegex.test(value);
        break;
      }
      case "cardNumber":
        isValid = /^\d{16}$/.test(value);
        break;
      case "cardExpireMonth": {
        const month = parseInt(value, 10);
        isValid = !isNaN(month) && month >= 1 && month <= 12;
        break;
      }
      case "cardExpireYear": {
        const year = Number.parseInt(value, 10);
        isValid = /^\d{4}$/.test(value) && year >= new Date().getFullYear();
        break;
      }
      case "cardCVV":
        isValid = /^\d{3}$/.test(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: !isValid }));
  };

  const getErrorMessage = (field) => {
    switch (field) {
      case "firstName":
      case "lastName":
      case "cardFullName":
        return "Must contain only letters and spaces, max 15 characters.";
      case "cardNumber":
        return "Must be exactly 16 digits.";
      case "cardExpireMonth":
        return "Must be a number between 1 and 12.";
      case "cardExpireYear":
        return "Must be a valid year and not in the past.";
      case "cardCVV":
        return "Must be exactly 3 digits.";
      default:
        return "Invalid input.";
    }
  };

  const renderInput = (field, placeholder, icon, keyboardType = "default") => (
    <View style={styles.inputWrapper}>
      <View
      style={[
          styles.inputContainer,
          errors[field] && styles.inputContainerError,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={colors.textOnPrimary}
          style={styles.inputIcon}
        />
        <TextInput
          value={newUser[field]}
          style={styles.input}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
        />
      </View>
      {errors[field] && (
        <Text style={styles.errorText}>{getErrorMessage(field)}</Text>
      )}
    </View>
  );

  const handleSave = async (formScreen) => {
    if (Object.values(errors).some((error) => error)) {
      Alert.alert("Validation Error", "Please fix the errors before saving.");
      return;
    }

    let bodyParams = {
      firstName: newUser.firstName !== "" ? newUser.firstName : user.firstName,
      lastName: newUser.lastName !== "" ? newUser.lastName : user.lastName,
      cardFullName:
        newUser.cardFullName !== "" ? newUser.cardFullName : user.cardFullName,
      cardNumber:
        newUser.cardNumber !== "" ? newUser.cardNumber : user.cardNumber,
      cardExpireMonth:
        newUser.cardExpireMonth !== ""
          ? newUser.cardExpireMonth
          : user.cardExpireMonth,
      cardExpireYear:
        newUser.cardExpireYear !== ""
          ? newUser.cardExpireYear
          : user.cardExpireYear,
      cardCVV: newUser.cardCVV !== "" ? newUser.cardCVV : user.cardCVV,
      sid: user.sid,
    };

    if (!ViewModel.isValidUser({ ...bodyParams, uid: user.uid })) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields to complete your profile"
      );
      return;
    }

    let serverUser;
    try {
      await CommunicationController.UpdateUser(user.uid, user.sid, bodyParams);
      serverUser = await CommunicationController.getUser(user.uid, user.sid);
    } catch (error) {
      Alert.alert("Error", "Failed to update user information");
      return;
    }

    serverUser = { ...serverUser, uid: user.uid, sid: user.sid };
    ViewModel.user = serverUser;

    try {
      await ViewModel.storageManager.saveUserAsync(serverUser);
    } catch (error) {
      console.error("Error saving user:", error);
      Alert.alert("Error", "Failed to save user information locally");
      return;
    }

    if (formScreen === "Info") {
      navigation.navigate("ProfilePage", { user: serverUser });
    } else if (formScreen === "Home") {
      navigation.navigate("Home", { user: serverUser, screen: "ConfirmOrder" });
    }
  };

  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("Form");
  };

  useEffect(() => {
    savePage();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={globalStyles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Edit Profile</Text>
          {renderInput("firstName", "First Name", "person", "default")}
          {renderInput("lastName", "Last Name", "people", "default")}
          {renderInput("cardFullName", "Card Full Name", "card", "default")}
          {renderInput("cardNumber", "Card Number", "card", "numeric")}
          {renderInput(
            "cardExpireMonth",
            "Card Expire Month",
            "calendar",
            "numeric"
          )}
          {renderInput(
            "cardExpireYear",
            "Card Expire Year",
            "calendar",
            "numeric"
          )}
          {renderInput("cardCVV", "Card CVV", "lock-closed", "numeric")}

          <TouchableOpacity
            style={globalStyles.button}
            onPress={() =>
              handleSave(before === "ProfilePage" ? "Info" : "Home")
            }
          >
            <Text style={globalStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  formContainer: {
    width: "90%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: textSizes.extraLarge,
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.textOnPrimary,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputIcon: {
    height: 0,
    width: 0,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: colors.textOnPrimary,
  },
  errorText: {
    color: colors.error,
    fontSize: textSizes.small,
    marginTop: 5,
  },
});

export default Form;
