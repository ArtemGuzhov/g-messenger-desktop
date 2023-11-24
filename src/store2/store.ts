import { makeAutoObservable } from "mobx";
import { AuthService } from "../services/AuthService";
import { createContext } from "react";
import { UserService } from "../services/UserService";
import { Chat, ChatEvent, Message, User } from "./store-additional";
import { ChatService } from "../services/ChatService";
import $socket from "../socket";

class Store {
  isInitLoading = false;

  auth = {
    isLoading: false,
    isAuth: false,
  };

  user = {
    profile: {} as User,
    team: [] as User[],
    isLoadingTeam: false,
  };

  chat = {
    selectedChat: null as Chat | null,
    list: [] as Chat[],
    isLoadingList: false,
    isAttachChatLoading: false,
  };

  message = {
    isLoadingAction: false,
    replyMessage: null as Message | null,
    commentsMessage: [] as Message[],
  };

  constructor() {
    makeAutoObservable(this, undefined, { deep: true });

    $socket.on(ChatEvent.CREATED_CHAT, (chat) => {
      this.chat.list = [{ ...chat, messages: [] }, ...this.chat.list];
    });

    $socket.on(ChatEvent.CREATED_MESSAGE, (data) => {
      this.addMessage(data);
    });
  }

  /**
   * Auth
   */

  async login(payload: { email: string; password: string }) {
    try {
      this.auth.isLoading = true;
      await AuthService.login(payload);
      this.auth.isAuth = true;
    } catch (error) {
      console.log(this.login.name, error);
    } finally {
      this.auth.isLoading = false;
    }
  }

  async validateToken() {
    try {
      this.auth.isLoading = true;
      await AuthService.validateToken();
      this.auth.isAuth = true;
    } catch (error) {
      console.log(this.validateToken.name, error);
    } finally {
      this.auth.isLoading = false;
    }
  }

  /**
   * Users
   */

  async getProfile() {
    try {
      this.isInitLoading = true;
      const user = await UserService.getProfile();
      this.user.profile = user;
    } catch (error) {
      console.log(this.getProfile.name, error);
      this.auth.isAuth = false;
    } finally {
      this.isInitLoading = false;
    }
  }

  async getTeam() {
    try {
      this.user.team = [];
      this.user.isLoadingTeam = true;
      const users = await UserService.getTeam();
      this.user.team = users;
    } catch (error) {
      console.log(this.getTeam.name, error);
    } finally {
      this.user.isLoadingTeam = false;
    }
  }

  async searchUser(emailOrName: string) {
    emailOrName = emailOrName.toLowerCase();
    await this.getTeam();
    this.user.team = this.user.team.filter(
      (user) =>
        user.name.toLowerCase().includes(emailOrName) ||
        user.email.includes(emailOrName)
    );
  }

  /**
   * Chats
   */

  async getChats() {
    try {
      this.chat.list = [];
      this.chat.isLoadingList = true;
      const chats = await ChatService.getChats();
      this.chat.list = this.chatsSort(chats);
      this.selectChat(this.chat.list[0].id);
    } catch (error) {
      console.log(this.getChats.name, error);
    } finally {
      this.chat.isLoadingList = false;
    }
  }

  async createDialog(userIds: string[], name?: string) {
    $socket.emit(ChatEvent.CREATE_CHAT, {
      userIds,
      name,
    });
  }

  async selectChat(chatId: string) {
    const chat = this.chat.list.find(({ id }) => id === chatId);

    if (chat) {
      this.chat.selectedChat = chat;
    }
  }

  async searchChats(name: string) {
    await this.getChats();
    this.chat.list = this.chat.list.filter((chat) =>
      chat.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  async attachChat(chatId: string) {
    try {
      this.chat.isAttachChatLoading = true;
    } catch (error) {
      console.log(this.attachChat.name, error);
    } finally {
      this.chat.isAttachChatLoading = false;
    }
  }

  async removeMessage(messageId: string) {
    try {
      this.message.isLoadingAction = true;
      this.chat.selectedChat.messages = this.chat.selectedChat.messages.filter(
        (msg) => msg.id !== messageId
      );
    } catch (error) {
      console.log(this.removeMessage.name, error);
    } finally {
      this.message.isLoadingAction = false;
    }
  }

  /**
   * Messages
   */

  createMessage(payload: { chatId: string; text: string }) {
    $socket.emit(ChatEvent.CREATE_MESSAGE, payload);
  }

  addMessage(data: { newMessage: Message; chatId: string }) {
    const chatId = data.chatId;

    if (this.chat.selectedChat === null) {
      return;
    }

    if (chatId === this.chat.selectedChat.id) {
      this.chat.selectedChat = {
        ...this.chat.selectedChat,
        messages: [data.newMessage, ...this.chat.selectedChat.messages],
      };
    }

    this.chat.list = this.chatsSort(
      this.chat.list.map((chat) => {
        if (chatId === chat.id) {
          return { ...chat, messages: [data.newMessage, ...chat.messages] };
        }

        return chat;
      })
    );
  }

  async replyMessage(payload: {
    chatId: string;
    messageId: string;
    text: string;
  }) {
    const message = this.chat.selectedChat.messages.find(
      (msg) => msg.id === payload.messageId
    );
    const replyMessage = {
      ...message,
      id: message.id + "313213123",
      text: payload.text,
      reply: message,
    };
    this.addMessage({ newMessage: replyMessage, chatId: payload.chatId });
  }

  setReplyMessage(messageId: string) {
    const message = this.chat.selectedChat.messages.find(
      (msg) => msg.id === messageId
    );

    if (message) {
      this.message.replyMessage = message;
    }
  }

  removeReplyMessage() {
    this.message.replyMessage = null;
  }

  private chatsSort(chats: Chat[]): Chat[] {
    return chats.sort(
      (a, b) =>
        new Date(
          (b.messages[0] ?? (b as unknown as Message)).createdAt
        ).getTime() -
        new Date(
          (a.messages[0] ?? (a as unknown as Message)).createdAt
        ).getTime()
    );
  }
}

const store = new Store();
const StoreContext = createContext<Store>(store);

export { Store, StoreContext };
