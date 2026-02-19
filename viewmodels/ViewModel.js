import CommunicationController from "../models/CommunicationController";
import StorageManager from "../models/StorageManager";
import PositionController from "../models/PositionController";
import * as Location from "expo-location";

class ViewModel {
  static storageManager = null;
  static positionController = null;
  static lastScreen = null;
  static lastMenu = null;
  static user = null;
  static lastOid = null;

  static async initViewModel(db) {
    if (!this.storageManager) this.storageManager = new StorageManager();
    if (!this.positionController) this.positionController = new PositionController();
    if (db) await this.storageManager.openDB();
  }

  static async getUserFromDB() {
    await this.initViewModel(true);
    const user = await this.storageManager.getUserFromDB();
    if (!user) {
      const newUser = await CommunicationController.createUser();
      await this.storageManager.saveUserInDB(newUser.uid, newUser.sid);
      return newUser;
    }
    return user;
  }

  static async getUserFromAsyncStorage() {
    await this.initViewModel(false);

    let user = null;
    try {
      user = await this.storageManager.getUserAsync();
    } catch (error) {
    }

    if (!user) {
      const newUser = await CommunicationController.createUser();
      const fullUser = await CommunicationController.getUser(newUser.uid, newUser.sid);
      const finalUser = { ...newUser, ...fullUser };

      try {
        await this.storageManager.saveUserAsync(finalUser);
        this.user = finalUser;
      } catch (error) {
      }

      return finalUser;
    } else {
      this.user = user;
      return user;
    }
  }

  static async saveUserAsync(user) {
    this.user = user;
    await this.storageManager.saveUserAsync(user);
  }

  static isValidUser(user) {
    if (!user) return false;
    return !(
      !user.uid || !user.sid || !user.firstName || !user.lastName ||
      !user.cardFullName || !user.cardNumber || !user.cardExpireMonth ||
      !user.cardExpireYear || !user.cardCVV
    );
  }

  static async getLocation() {
    await this.positionController.getLocationAsync();
  }

  static getLocationCoords() {
    if (!this.positionController.location) {
      throw new Error("Location unavailable — permission may have been denied");
    }
    return this.positionController.location.coords;
  }

  static async getAddress() {
    const coords = this.getLocationCoords();
    const address = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    return address[0];
  }

  static async getPositionController() {
    await this.initViewModel(false);
    return this.positionController;
  }

  static async getMenu(mid, sid) {
    await this.initViewModel(false);
    try {
      const coords = this.getLocationCoords();
      return await CommunicationController.GetMenu(mid, sid, coords.latitude, coords.longitude);
    } catch (error) {
      return null;
    }
  }

  static async getIngredients(mid, sid) {
    await this.initViewModel(false);
    try {
      return await CommunicationController.GetIngredients(mid, sid);
    } catch (error) {
      return null;
    }
  }

  static async getUpdatedImage(mid, sid, lastVersion) {
    await this.initViewModel(true);

    let savedImage;
    try {
      savedImage = await this.storageManager.getImageFromDB(mid);
    } catch (error) {
    }

    let image;
    if (!savedImage) {
      image = await CommunicationController.GetImage(mid, sid);
      await this.storageManager.saveImageInDB(mid, lastVersion, image.base64, false);
      return image.base64;
    }

    if (savedImage.imageVersion !== lastVersion) {
      image = await CommunicationController.GetImage(mid, sid);
      await this.storageManager.saveImageInDB(mid, lastVersion, image.base64, true);
      return image.base64;
    }

    return savedImage.image;
  }

  static async getMenuDetail(menu, sid) {
    await this.initViewModel(true);
    const newmenu = await this.getMenu(menu.mid, sid);
    if (!newmenu) return null;
    menu = { ...menu, ...newmenu };
    this.lastMenu = menu;
    return menu;
  }

  static async getMenuDetailLongDesc(menu, user) {
    const coords = this.getLocationCoords();
    let newMenu = await CommunicationController.GetMenu(
      menu.mid,
      user.sid,
      coords.latitude,
      coords.longitude
    );
    menu = { ...menu, ...newMenu };
    return menu;
  }

  static async getHomePageMenu(menu, sid) {
    const image = await this.getUpdatedImage(menu.mid, sid, menu.imageVersion);
    menu.image = `data:image/png;base64,${image}`;
    return menu;
  }

  static async getMenus(sid) {
    const coords = this.getLocationCoords();
    let menus = await CommunicationController.GetMenus(
      coords.latitude,
      coords.longitude,
      sid
    );
    menus = await Promise.all(menus.map(menu => this.getHomePageMenu(menu, sid)));
    return menus;
  }

  static setLastScreen(screen) {
    this.lastScreen = screen;
  }

  static setLastMenu(menu) {
    this.lastMenu = menu;
  }

  static async getLastMenu() {
    if (!this.lastMenu) {
      const newMenu = await this.storageManager.getLastMenuAsync();
      this.lastMenu = newMenu;
      return newMenu;
    }
    return this.lastMenu;
  }

  static async saveLastScreenAsync(screen) {
    await this.storageManager.saveUserAsync(this.user);
    await this.storageManager.saveLastScreenAsync(screen, this.lastMenu);
  }

  static async getLastScreenAsync() {
    const screen = await this.storageManager.getLastScreenAsync();
    ViewModel.setLastScreen(screen.screen);
    ViewModel.setLastMenu(screen.lastMenu);
    return screen;
  }

  static getInitialRouteNames(lastScreen) {
    let initialRouteNames = new Map();

    switch (lastScreen) {
      case "Menu":
        initialRouteNames.set("Root", "Home");
        initialRouteNames.set("Home", "Menu");
        initialRouteNames.set("Profile", "ProfilePage");
        break;
      case "ConfirmOrder":
        initialRouteNames.set("Root", "Home");
        initialRouteNames.set("Home", "ConfirmOrder");
        initialRouteNames.set("Profile", "ProfilePage");
        break;
      case "Homepage":
        initialRouteNames.set("Root", "Home");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "ProfilePage");
        break;
      case "Ingredients":
        initialRouteNames.set("Root", "Home");
        initialRouteNames.set("Home", "Ingredients");
        initialRouteNames.set("Profile", "ProfilePage");
        break;
      case "ProfilePage":
        initialRouteNames.set("Root", "Profile");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "ProfilePage");
        break;
      case "Form":
        initialRouteNames.set("Root", "Profile");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "Form");
        break;
      case "Order":
        initialRouteNames.set("Root", "Order");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "ProfilePage");
        break;
      default:
        // Unknown screen name — fall back to Homepage so navigation always resolves
        initialRouteNames.set("Root", "Home");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "ProfilePage");
    }

    return initialRouteNames;
  }

  static async confirmOrder(menu, user, coords) {
    try {
      let order = await CommunicationController.createOrder(
        menu.mid,
        user.sid,
        coords.latitude,
        coords.longitude
      );
      this.lastOid = order.oid;
      const newUser = {
        ...user,
        lastOid: order.oid,
        orderStatus: order.status,
      };
      await this.saveUserAsync(newUser);
      this.user = newUser;
      return { order, newUser };
    } catch (error) {
      if (
        error.message ===
        'Error message from the server. HTTP status: 409 {"message":"User already has an active order"}'
      ) {
        const customError = new Error("You already have an active order");
        customError.status = 409;
        throw customError;
      }
      throw error;
    }
  }

  static async getOrder(oid, sid) {
    return await CommunicationController.getOrder(oid, sid);
  }

  static async reset() {
    await this.initViewModel(true);
    await this.storageManager.deleteDB();
    await this.storageManager.deleteUserAsync();
  }

  static async checkFirstRun() {
    await this.initViewModel(false);
    let user = null;
    try {
      user = await this.storageManager.getUserAsync();
    } catch (error) {
    }
    return !user;
  }

  static async initApp() {
    await this.initViewModel(false);
    const firstRun = await this.checkFirstRun();

    if (firstRun) {
      return { firstRun: true, user: null, location: null };
    } else {
      const user = await this.getUserFromAsyncStorage();
      const lastScreen = await this.storageManager.getLastScreenAsync();
      this.user = user;
      await this.positionController.getLocationAsync();
      return {
        firstRun: false,
        user,
        location: this.positionController.location,
        lastScreen: lastScreen.screen,
      };
    }
  }

  static async getTimeRemaining(deliveryTimestamp) {
    const now = new Date();
    const deliveryTime = new Date(deliveryTimestamp);
    const diffInMs = deliveryTime - now;
    const seconds = Math.floor(diffInMs / 1000) % 60;
    const minutes = Math.floor(diffInMs / (1000 * 60)) % 60;
    const hours = Math.floor(diffInMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    let string = "";
    if (days > 0) string += `${days} days, `;
    if (hours > 0) string += `${hours} hours, `;
    if (minutes > 0) string += `${minutes} minutes, `;
    if (seconds > 0) string += `${seconds} seconds`;
    return string || "Less than a second";
  }

  static getDeliveryTime(minutes) {
    if (minutes === 0) return "less than a minute";
    let string = "";
    if (minutes >= 1440) {
      string += `${Math.floor(minutes / 1440)} days `;
      minutes %= 1440;
    }
    if (minutes >= 60) {
      string += `${Math.floor(minutes / 60)} hours `;
      minutes %= 60;
    }
    if (minutes > 0) string += `${minutes} minutes`;
    return string;
  }

  static fromTimeStampToDayAndTime(timestamp) {
    if (!timestamp) return "Not available";
    const [date, time] = timestamp.split("T");
    const [y, m, d] = date.split("-");
    const timeClean = time.split(".")[0].slice(0, -3);
    return `${d}/${m}/${y} at ${timeClean}`;
  }
}

export default ViewModel;