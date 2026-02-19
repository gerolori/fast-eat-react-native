/* eslint-disable react/prop-types */
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ViewModel from "../../viewmodels/ViewModel";
import LoadingScreen from "../common/LoadingScreen";
import { colors, textSizes, globalStyles } from "../../styles/styles";

const MenusList = ({ menus = [], user, setChanged }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();

  const handleMenuDetails = (item) => {
    ViewModel.lastMenu = item;
    navigation.navigate("Menu", { menu: item, user: user });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await ViewModel.getLocation();
    setRefreshing(false);
    setChanged((prev) => !prev);
  };

  if (menus === null) {
    return <LoadingScreen />;
  }

  return (
    <FlatList
      data={menus}
      keyExtractor={(item) => item.mid.toString()}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleMenuDetails(item)}
          style={styles.card}
        >
          <Image
            source={
              item.image
                ? { uri: item.image }
                : require("../../assets/logo/logo.png")
            }
            style={styles.menuImage}
          />

          <View style={styles.textContainer}>
            <Text style={styles.menuTitle}>{item.name}</Text>
            <Text style={styles.menuDescription}>
              {item.shortDescription
                ? item.shortDescription
                : "Description not available"}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.menuPrice}>
              {item.price ? `${item.price.toFixed(2)} €` : "N/A"}
            </Text>
            <Text style={styles.menuEta}>
              {item.deliveryTime ? `${item.deliveryTime} min` : "N/A"}
            </Text>
          </View>
        </TouchableOpacity>
      )}
        ListHeaderComponent={
          <Text style={globalStyles.headerText}>Choose your menu</Text>
        }
      ListEmptyComponent={
        <Text style={styles.emptyMessage}>No menu available</Text>
      }
      showsVerticalScrollIndicator={true}
      ListFooterComponent={<View style={styles.footerSpace} />}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  menuTitle: {
    fontSize: textSizes.medium,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: textSizes.small,
    color: colors.textSecondary,
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  menuPrice: {
    fontSize: textSizes.medium,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  menuEta: {
    fontSize: textSizes.small,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default MenusList;
