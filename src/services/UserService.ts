import { User } from "../store/store-additional";
import $api from "../http";

export class UserService {
  static async getProfile(): Promise<User> {
    const { data: response } = await $api.get("/api/v1/users/my-profile");
    return response.data;
  }

  static async getTeam(): Promise<User[]> {
    const { data: response } = await $api.get("/api/v1/users/my-team");
    return response.data;
  }
}
