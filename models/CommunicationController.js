import Constants from "expo-constants";

export default class CommunicationController {
  static BASE_URL =
    Constants.expoConfig?.extra?.baseUrl ||
    "https://fallback-placeholder.com/";

  static async genericRequest(endpoint, verb, queryParams, bodyParams) {
    const queryParamsFormatted = new URLSearchParams(queryParams).toString();
    const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
    let fetchData = {
      method: verb,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (verb != "GET") {
      fetchData.body = JSON.stringify(bodyParams);
    }
    let httpResponse = await fetch(url, fetchData);

    const status = httpResponse.status;
    if (status == 200) {
      let deserializedObject = await httpResponse.json();
      return deserializedObject;
    } else if (status == 204) {
      // No Content — likely a PUT with no response body
    } else {
      const message = await httpResponse.text();
      let error = new Error(
        "Error message from the server. HTTP status: " + status + " " + message
      );
      throw error;
    }
  }

  static async createUser() {
    const endpoint = "user";
    const verb = "POST";
    return await this.genericRequest(endpoint, verb, {}, {});
  }

  static async getUser(uid, sid) {
    const endpoint = "user/" + uid;
    const verb = "GET";
    const queryParams = { sid: sid };
    return await this.genericRequest(endpoint, verb, queryParams, null);
  }

  static async UpdateUser(uid, sid, bodyParams, queryParams = {}) {
    const endpoint = "user/" + uid;
    const verb = "PUT";
    bodyParams = { sid: sid, ...bodyParams };
    return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
  }

  static async SubscriptionEnable(uid, sid) {
    const endpoint = "user/febbraio1" + uid + "/subscription/enable";
    const verb = "PUT";
    return await this.genericRequest(endpoint, verb, {}, {sid: sid});
  }

  static async getCompletedOrders(uid, sid) {
    const endpoint = "user/febbraio2" + uid + "/completed";
    const verb = "GET";
    const queryParams = { sid: sid };
    return await this.genericRequest(endpoint, verb, queryParams, {});
  }

  static async GetMenus(lat, long, sid) {
    const endpoint = "menu";
    const verb = "GET";
    const queryParams = { lat: lat, lng: long, sid: sid };
    return await this.genericRequest(endpoint, verb, queryParams, {});
  }

  // longDesc is only available in the detail endpoint, not the list endpoint
  static async GetMenu(mid, sid, lat, lng) {
    const endpoint = "menu/" + mid;
    const verb = "GET";
    const queryParams = { lat: lat, lng: lng, sid: sid };
    let response = null;
    try {
      response = await this.genericRequest(endpoint, verb, queryParams, {});
      return response;
    } catch (error) {
      console.error(`Failed to fetch menu ${mid}:`, error.message);
      throw error;
    }
  }

  static async GetIngredients(mid, sid) {
    const endpoint = "menu/gennaio/" + mid + "/ingredients";
    const verb = "GET";
    const queryParams = { sid: sid };
    return await this.genericRequest(endpoint, verb, queryParams, {});
  }

  static async GetImage(mid, sid) {
    const endpoint = "menu/" + mid + "/image";
    const verb = "GET";
    const queryParams = { sid: sid };
    return await this.genericRequest(endpoint, verb, queryParams, {});
  }

  static async createOrder(mid, sid, lat, lng) {
    const endpoint = "menu/" + mid + "/buy";
    const verb = "POST";
    const bodyParams = { sid: sid, deliveryLocation: { lat: lat, lng: lng } };
    return await this.genericRequest(endpoint, verb, {}, bodyParams);
  }

  // Returns the last order when oid is the user's stored lastOid
  static async getOrder(oid, sid) {
    const endpoint = "order/" + oid;
    const verb = "GET";
    const queryParams = { sid: sid };
    return await this.genericRequest(endpoint, verb, queryParams, {});
  }
}
