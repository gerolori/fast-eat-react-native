import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class StorageManager {
  constructor() {
    this.db = null;
  }

  async openDB() {
    this.db = await SQLite.openDatabaseAsync("usersDB", {
      useNewConnection: true,
    });

    const query =
      "CREATE TABLE IF NOT EXISTS users (ID INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, sid TEXT); CREATE TABLE IF NOT EXISTS menuImages (mid INTEGER PRIMARY KEY, imageVersion INTEGER, image TEXT)";
    await this.db.execAsync(query);
  }

  async saveUserInDB(uid, sid) {
    const query = "INSERT OR REPLACE INTO users (uid, sid) VALUES (?, ?)";
    await this.db.runAsync(query, uid, sid);
  }
  
  async getUserFromDB() {
    const query = "SELECT * FROM users";
    const result = await this.db.getFirstAsync(query);
    return result;
  }

  async getImageFromDB(mid) {
    const query = "SELECT * FROM menuImages WHERE mid = ?";
    const result = await this.db.getFirstAsync(query, mid);
    return result;
  }

  async saveImageInDB(mid, imageVersion, image, alreadyExists) {
    if (alreadyExists) {
      const query = "UPDATE menuImages SET imageVersion = ?, image = ? WHERE mid = ?";
      await this.db.runAsync(query, imageVersion, image, mid);
    } else {
      const query = "INSERT INTO menuImages (mid, imageVersion, image) VALUES (?, ?, ?)";
      await this.db.runAsync(query, mid, imageVersion, image);
    }
  }

  async deleteUserFromDB() {
    const query = "DELETE FROM users";
    await this.db.runAsync(query);
  }

  async closeDB() {
    await this.db.closeAsync();
  }

  async deleteDB() {
    await this.db.execAsync("DROP TABLE users");
    await this.db.execAsync("DROP TABLE menuImages");
  }

  async saveUserAsync(user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }
  
  async getUserAsync() {
    try {
      const user = await AsyncStorage.getItem("user");
      return JSON.parse(user);
    } catch (error) {
      console.error("Failed to get user from AsyncStorage:", error);
      return null;
    }
  }

  async deleteUserAsync() {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("lastScreen");
    await AsyncStorage.removeItem("lastMenu");
  }
  
  async saveLastScreenAsync(screen, lastMenu) {
    if (lastMenu) {
      await AsyncStorage.setItem("lastMenu", JSON.stringify(lastMenu));
    }
    if (screen) {
      await AsyncStorage.setItem("lastScreen", screen);
    }
  }

  async getLastScreenAsync() {
    const screen = await AsyncStorage.getItem("lastScreen");
    const lastMenu = await AsyncStorage.getItem("lastMenu");
    return { screen, lastMenu: JSON.parse(lastMenu) };
  }

  async getLastMenuAsync() {
    const lastMenu = await AsyncStorage.getItem("lastMenu");
    return JSON.parse(lastMenu);
  }
}
