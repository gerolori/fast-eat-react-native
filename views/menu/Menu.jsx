import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { X } from "lucide-react-native";
import ViewModel from "../../viewmodels/ViewModel";
import LoadingScreen from "../common/LoadingScreen";
import { globalStyles, colors, textSizes } from "../../styles/styles";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Menu = () => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState(null);
  const [user, setUser] = useState(ViewModel.user);
  const [longMenu, setLongMenu] = useState(null);
  const [detailsHeight, setDetailsHeight] = useState(0);

  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("Menu");
  };

  useEffect(() => {
    if (menu) {
      savePage();
      ViewModel.getUserFromAsyncStorage()
        .then((result) => {
          setUser(result);
          ViewModel.user = result;
        })
        .catch((error) => {
          console.error("Error while loading the user:", error);
        });

      ViewModel.lastMenu = menu;
      ViewModel.getMenuDetailLongDesc(menu, user)
        .then((result) => {
          setLongMenu(result);
        })
        .catch((error) => {
          console.error("Error while loading the menu:", error);
        });
    } else {
      ViewModel.getLastMenu()
        .then((result) => {
          setMenu(result);
        })
        .catch((error) => {
          console.error("Failed to load last menu:", error);
        });
    }
  }, [menu]);

  const onClickOnButton = () => {
    const user = ViewModel.user;
    if (!ViewModel.isValidUser(user)) {
      Alert.alert(
        "Profile not complete!",
        "Complete your profile to order and enjoy this menu.",
        [
          {
            text: "Complete Profile",
            onPress: () =>
              navigation.navigate("Profile", {
                screen: "Form",
                params: { user: user, before: "CompleteProfile" },
              }),
            isPreferred: true,
          },
        ],
        { cancelable: true }
      );
    } else {
      navigation.navigate("ConfirmOrder");
    }
  };

  const onClickIngredientsButton = () => {
    navigation.navigate("Home", {
      screen: "Ingredients",
      params: { menuId: longMenu.mid, user: user },
    });
  };

  if (longMenu !== null && user) {
    return (
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              navigation.navigate("Homepage");
            }}
          >
            <X color={colors.blackItem} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.menuInfo}
          contentContainerStyle={{ paddingBottom: detailsHeight }}
        >
          <Image
            source={
              longMenu.image
                ? { uri: longMenu.image }
                : require("../../assets/logo/logo.png")
            }
            style={styles.menuImage}
          />
          <Text style={styles.title}>{longMenu.name}</Text>

          <TouchableOpacity
            style={styles.ingredientsButton}
            onPress={onClickIngredientsButton}
          >
            <Text style={globalStyles.buttonText}> Ingredients </Text>
          </TouchableOpacity>

          <Text style={styles.description}>{longMenu.longDescription}</Text>
        </ScrollView>

        <View
          style={styles.detailsContainer}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setDetailsHeight(height);
          }}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.price}>
              {longMenu.price ? `€${longMenu.price.toFixed(2)}` : "N/A"}
            </Text>
            <Text style={styles.deliveryTime}>
              delivery in {ViewModel.getDeliveryTime(longMenu.deliveryTime)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginTopButton}
            onPress={onClickOnButton}
          >
            <Text style={globalStyles.buttonText}> Buy </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return <LoadingScreen />;
};

const styles = {
  container: {
    ...globalStyles.container,
    padding: 16,
  },
  ingredientsButton: {
    ...globalStyles.button,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 8,
  },
  menuImage: {
    width: "100%",
    height: width - 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    ...globalStyles.title,
    marginBottom: 8,
  },
  description: {
    ...globalStyles.textSecondary,
    marginBottom: 16,
  },
  detailsContainer: {
    ...globalStyles.container,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  price: {
    fontSize: textSizes.extraLarge,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "right",
  },
  deliveryTime: {
    fontSize: textSizes.small,
    textAlign: "right",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  marginTopButton: {
    ...globalStyles.button,
    margin: 15,
  },
};

export default Menu;
