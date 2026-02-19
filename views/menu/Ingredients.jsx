import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import LoadingScreen from "../../views/common/LoadingScreen";
import ViewModel from "../../viewmodels/ViewModel";
import { globalStyles, colors, textSizes } from "../../styles/styles";

const Ingredients = () => {
  const [ingredients, setIngredients] = React.useState(null);
  const [menu, setMenu] = React.useState(ViewModel.lastMenu || null);
  const [user, setUser] = React.useState(ViewModel.user || null);

  const initIngredients = async () => {
    await ViewModel.saveLastScreenAsync("Ingredients");
    const ingredient = await ViewModel.getIngredients(menu.mid, user.sid);
    setIngredients(ingredient);
  };

  useEffect(() => {
    initIngredients();
  }, []);

  if (ingredients === null) {
    return <LoadingScreen />;
  }

  const handleIngredientDialog = (item) => {
    Alert.alert(
      "Ingredient Details",
      `Name: ${item.name}\nDescription: ${item.description}`
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleIngredientDialog(item)}>
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.origin}>Origin: {item.origin}</Text>
        <Text style={styles.bio}>
          {item.bio ? "Biological: Yes" : "Biological: No"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={ingredients}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={styles.empty}>No ingredients available</Text>
      }
    />
  );
};

export default Ingredients;

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    backgroundColor: colors.background,
    padding: textSizes.medium,
    marginVertical: textSizes.small,
    marginHorizontal: textSizes.medium,
  },
  name: {
    fontSize: textSizes.large,
    fontWeight: "bold",
    color: colors.textPrimary,
    alignItems: "flex-start",
    marginBottom: textSizes.small,
  },
  description: {
    fontSize: textSizes.small,
    color: colors.textSecondary,
    marginBottom: textSizes.small,
  },
  origin: {
    fontSize: textSizes.small,
    color: colors.textSecondary,
    marginBottom: textSizes.small,
  },
  bio: {
    fontSize: textSizes.small,
    color: colors.primary,
    alignItems: "flex-end",
  },
  empty: {
    textAlign: "center",
    fontSize: textSizes.medium,
    color: colors.textSecondary,
    marginTop: textSizes.medium,
  },
});
