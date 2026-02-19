import * as Location from "expo-location";

export default class PositionController {
  
  constructor() {
  this.location = null;
  this.canUseLocation = false;
  }

  async locationPermissionAsync() {
  const grantedPermission = await Location.getForegroundPermissionsAsync();
  if (grantedPermission.status === "granted") {
    this.canUseLocation = true;
  } else {
    const permissionResponse =
    await Location.requestForegroundPermissionsAsync();
    if (permissionResponse.status === "granted") {
    this.canUseLocation = true;
    }
  }
  }

  async getLocationAsync() {
  await this.locationPermissionAsync();
  if (this.canUseLocation) {
    this.location = await Location.getCurrentPositionAsync();
  }
  }

  async reverseGeocode() {
  let address = await Location.reverseGeocodeAsync({
    latitude: this.location.coords.latitude,
    longitude: this.location.coords.longitude,
  });
  return address;
  };
}
