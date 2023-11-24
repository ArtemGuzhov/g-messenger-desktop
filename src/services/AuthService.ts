import $api from "../http";

export class AuthService {
  static async login(payload: {
    email: string;
    password: string;
  }): Promise<void> {
    const { data: response } = await $api.post(`/api/v1/auth/sign-in`, payload);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.accessToken);
  }

  static async validateToken(): Promise<void> {
    await $api.get(`/api/v1/auth/validate`);
  }

  static async logout(): Promise<void> {
    await $api.patch(`/api/v1/auth/logout`);
  }
}
