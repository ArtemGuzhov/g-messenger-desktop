import { makeAutoObservable } from "mobx";
import { AuthService } from "../services/AuthService";
import { createContext } from "react";
import { UserService } from "../services/UserService";
import { Chat, Message, User } from "./store-additional";

class Store {
  isInitLoading = false;

  isAuth = false;
  isAuthLoading = false;

  profile: User | null = null;
  isProfileLoading = false;

  chatList: Chat[] = [];
  favoriteChatList: Chat[] = [];
  selectedChat: Chat | null = null;
  isChatListLoading = false;

  messageList: Message[] = [];
  commentedMessage: Message | null = null;
  repliedMessage: Message | null = null;
  commentList: Message[] = [];
  isMessageList = false;

  userList: User[] = [];
  isUserListLoading = false;

  notifications: { id: string; title: string; message: string }[] = [];
  errors: { id: string; message: string }[] = [];

  constructor() {
    makeAutoObservable(this, undefined, { deep: true });
  }

  async init() {
    try {
      this.isInitLoading = true;
      await this.getProfile();
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    } catch {
      /* empty */
    } finally {
      this.isInitLoading = false;
    }
  }

  /**
   * Notifications and Erros
   */

  removeError(id: string) {
    this.errors = this.errors.filter((e) => e.id !== id);
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  /**
   * Auth
   */

  async login(payload: { email: string; password: string }) {
    try {
      this.isAuthLoading = true;
      await AuthService.login(payload);
      this.isAuth = true;
    } catch (error) {
      this.errors.push({
        id: "",
        message: "Ошибка при авторизации",
      });
    } finally {
      this.isAuthLoading = false;
    }
  }

  async validateToken() {
    try {
      this.isAuthLoading = true;
      await AuthService.validateToken();
      this.isAuth = true;
    } catch (error) {
      this.errors.push({
        id: "",
        message: "Ошибка при авторизации",
      });
    } finally {
      this.isAuthLoading = false;
    }
  }

  async logout() {
    try {
      this.isAuthLoading = true;
      await AuthService.logout();
      this.isAuth = false;
      this.profile = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      this.errors.push({
        id: "",
        message: "Ошибка при выходе",
      });
    } finally {
      this.isAuthLoading = false;
    }
  }

  /**
   * Users
   */

  async getProfile() {
    try {
      this.isProfileLoading = true;
      const user = await UserService.getProfile();
      this.profile = user;
    } catch (error) {
      this.errors.push({
        id: "",
        message: "Ошибка получения профиля",
      });
      this.isAuth = false;
    } finally {
      this.isProfileLoading = false;
    }
  }
}

const store = new Store();
const StoreContext = createContext<Store>(store);

export { Store, StoreContext };
