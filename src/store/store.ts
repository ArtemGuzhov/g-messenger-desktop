import { makeAutoObservable, runInAction } from "mobx";
import { v4 } from "uuid";
import { AuthService } from "../services/AuthService";
import { createContext } from "react";
import { UserService } from "../services/UserService";
import {
  Chat,
  ChatEvent,
  ChatType,
  CreateChatPayload,
  CreateMessagePayload,
  Message,
  MessageStatus,
  MessageType,
  User,
} from "./store-additional";
import $socket from "../socket";
import { ChatService } from "../services/ChatService";

class Store {
  isInitLoading = false;

  isAuth = false;
  isAuthLoading = false;

  myId = "";
  profile: User | null = null;
  isProfileLoading = false;

  isCreateChatLoading = false;
  chatList: Chat[] = [];
  favoriteChatList: Chat[] = [];
  favoriteChatIds: string[] = [];
  selectedChat: Chat | null = null;
  isChatListLoading = false;

  isMessageListLoading = true;
  isMessageCommentsLoading = false;
  messageList: Message[] = [];
  commentedMessage: Message | null = null;
  repliedMessage: Message | null = null;
  commentList: Message[] = [];

  userList: User[] = [];
  isUserListLoading = false;

  notifications: { id: string; title: string; message: string }[] = [];
  errors: { id: string; message: string }[] = [];
  files: { id: string; image: string }[] = [];

  constructor() {
    makeAutoObservable(this, {}, { deep: true });

    $socket.on(ChatEvent.CREATED_CHAT, (chat: Chat) => {
      if (chat.type === ChatType.DIALOG) {
        const profile = chat.users.filter((user) => user.id !== this.myId)[0];

        chat = {
          ...chat,
          avatar: profile.avatar ?? null,
          name: profile.name ?? null,
          label: profile.label,
        };
      } else {
        chat = { ...chat, label: `${chat.usersCount}` };
      }

      const isFavorite = !!this.favoriteChatIds.includes(chat.id);

      if (isFavorite) {
        this.favoriteChatList = [chat, ...this.favoriteChatList];
        return;
      }
      this.chatList = [chat, ...this.chatList];
      this.isCreateChatLoading = false;
    });

    $socket.on(
      ChatEvent.CREATED_MESSAGE,
      async (payload: {
        chatId: string;
        clientId: string;
        message: Message;
      }) => {
        if (!payload.message.rootId) {
          const messageIndex = this.messageList.findIndex(
            (msg) =>
              msg.id === payload.clientId &&
              msg.chatId === payload.chatId &&
              msg.status === MessageStatus.PENDING
          );

          this.messageList = this.messageList.map((msg, index) => {
            if (index === messageIndex) {
              return {
                ...payload.message,
                status: MessageStatus.OK,
                repliedTo: { ...payload.message.repliedTo, ...msg.repliedTo },
              };
            }

            return msg;
          });
          this.updateChatPosition(payload.chatId);
        } else {
          const commentIndex = this.commentList.findIndex(
            (msg) =>
              msg.id === payload.clientId &&
              msg.chatId === payload.chatId &&
              msg.status === MessageStatus.PENDING
          );

          this.commentList = this.commentList.map((msg, index) => {
            if (index === commentIndex) {
              return {
                ...payload.message,
                status: MessageStatus.OK,
                repliedTo: { ...payload.message.repliedTo, ...msg.repliedTo },
              };
            }

            return msg;
          });
        }
      }
    );

    $socket.on(
      ChatEvent.CREATE_MESSAGE_ERROR,
      (payload: { clientId: string; chatId: string }) => {
        const messageIndex = this.messageList.findIndex(
          (msg) =>
            msg.id === payload.clientId &&
            msg.chatId === payload.chatId &&
            msg.status === MessageStatus.PENDING
        );

        this.messageList = this.messageList.map((msg, index) => {
          if (index === messageIndex) {
            return { ...msg, status: MessageStatus.ERROR };
          }

          return msg;
        });
      }
    );

    $socket.on(ChatEvent.IS_EXIST_CHAT, (payload: { chatId: string }) => {
      const chat = this.chatList.find((chat) => chat.id === payload.chatId);

      if (chat) {
        this.selectedChat = chat;
      }
    });

    $socket.on(
      ChatEvent.DELETED_MESSAGE,
      (payload: { id: string; chatId: string; isComment: boolean }) => {
        if (payload.isComment) {
          this.commentList = this.commentList.map((msg) => {
            if (msg.id === payload.id) {
              return {
                ...msg,
                status: MessageStatus.OK,
                deletedAt: new Date().toISOString(),
              };
            }

            return msg;
          });
          return;
        }

        this.messageList = this.messageList.map((msg) => {
          if (msg.id === payload.id) {
            return {
              ...msg,
              status: MessageStatus.OK,
              deletedAt: new Date().toISOString(),
            };
          }

          return msg;
        });

        this.chatList = this.chatList.map((chat) => {
          if (chat.id === payload.chatId) {
            return { ...chat, lastMessage: "Сообщение удалено" };
          }

          return chat;
        });
      }
    );
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

  setFile(id: string, image: string) {
    this.files = [...this.files, { id, image }];
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
        id: v4(),
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
        id: v4(),
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
        id: v4(),
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
      this.favoriteChatIds = user.favoriteChatIds;
      this.myId = user.id;
    } catch (error) {
      this.errors.push({
        id: v4(),
        message: "Ошибка получения профиля",
      });
      this.isAuth = false;
    } finally {
      this.isProfileLoading = false;
    }
  }

  async getUserTeam() {
    try {
      this.isUserListLoading = true;
      const users = await UserService.getTeam();
      this.userList = users;
    } catch (error) {
      this.errors.push({
        id: v4(),
        message: "Ошибка получения пользователей",
      });
    } finally {
      this.isUserListLoading = false;
    }
  }

  async searchInTeam(emailOrName: string) {
    emailOrName = emailOrName.toLowerCase();
    await this.getUserTeam();
    this.userList = this.userList.filter(
      (user) =>
        user.name.toLowerCase().includes(emailOrName) ||
        user.email.includes(emailOrName)
    );
  }

  async addOrDelFavoriteChat(chatId: string) {
    try {
      await UserService.addOrDelFavoriteChat(chatId);

      const isExist = this.favoriteChatIds.find((id) => id === chatId);

      if (isExist) {
        const chat = this.favoriteChatList.find((chat) => chat.id === chatId);

        this.favoriteChatIds = this.favoriteChatIds.filter(
          (id) => id !== chatId
        );
        this.favoriteChatList = this.favoriteChatList.filter(
          (chat) => chat.id !== chatId
        );
        this.chatList = [...this.chatList, { ...chat, isFavorite: false }];
        this.selectedChat = { ...this.selectedChat, isFavorite: false };

        return;
      }

      const chat = this.chatList.find((chat) => chat.id === chatId);

      runInAction(() => {
        this.favoriteChatIds = [...this.favoriteChatIds, chatId];
        this.chatList = this.chatList.filter((chat) => chat.id !== chatId);
        this.favoriteChatList = [
          ...this.favoriteChatList,
          { ...chat, isFavorite: true },
        ];
        this.selectedChat = { ...this.selectedChat, isFavorite: true };
      });
    } catch (error) {
      this.errors.push({
        id: v4(),
        message: "Ошибка изменения чата",
      });
    }
  }

  /**
   * Chats
   */

  async getUserChats(isInit?: boolean) {
    try {
      this.isChatListLoading = true;
      const chats = await ChatService.getChats();

      const favoriteChatList: Chat[] = [];
      const chatList: Chat[] = [];

      for (let chat of chats) {
        const isFavorite = !!this.favoriteChatIds.includes(chat.id);

        if (chat.type === ChatType.DIALOG) {
          const profile = chat.users.filter((user) => user.id !== this.myId)[0];

          chat = {
            ...chat,
            avatar: profile.avatar ?? null,
            name: profile.name ?? null,
            label: profile.label,
          };
        } else {
          chat = { ...chat, label: `${chat.usersCount}` };
        }

        if (isFavorite) {
          favoriteChatList.push({ ...chat, isFavorite });
          continue;
        }
        chatList.push({ ...chat, isFavorite });
      }

      this.chatList = chatList;
      this.favoriteChatList = favoriteChatList;

      if (isInit && chats.length) {
        if (chatList.length) {
          this.selectedChat = chatList[0];
          return;
        }

        if (favoriteChatList.length) {
          this.selectedChat = favoriteChatList[0];
        }
      }
    } catch (error) {
      this.errors.push({
        id: v4(),
        message: "Ошибка получения чатов",
      });
    } finally {
      this.isChatListLoading = false;
    }
  }

  async searchInChat(name: string) {
    try {
      this.isChatListLoading = true;
      name = name.toLowerCase();
      this.favoriteChatList = [];
      const chats = await ChatService.getChats();

      const chatList = [];

      for (let chat of chats) {
        if (chat.type === ChatType.DIALOG) {
          const profile = chat.users.filter(
            (user) => user.id !== this.profile.id
          )[0];

          chat = {
            ...chat,
            avatar: profile.avatar ?? null,
            name: profile.name ?? null,
            label: profile.label,
          };
        } else {
          chat = { ...chat, label: `${chat.usersCount}` };
        }

        chatList.push(chat);
      }

      this.chatList = chatList.filter((chat) =>
        chat.name.toLowerCase().includes(name)
      );
    } catch {
      await this.getUserChats();
    } finally {
      this.isChatListLoading = false;
    }
  }

  async concateChats() {
    this.chatList = [...this.chatList, ...this.favoriteChatList];
  }

  async setChat(chatId: string) {
    const chat = [...this.chatList, ...this.favoriteChatList].find(
      ({ id }) => id === chatId
    );
    this.selectedChat = chat;
  }

  async setIsNotReadChats() {
    this.chatList = [...this.chatList, ...this.favoriteChatList].filter(
      (chat) => chat.isNotReadMessagesCount
    );
  }

  async createChat(payload: CreateChatPayload) {
    $socket.emit(ChatEvent.CREATE_CHAT, payload);
    this.isCreateChatLoading = true;
    setTimeout(() => {
      this.isCreateChatLoading = false;
    }, 5_000);
  }

  /**
   * Messages
   */

  async getChatMessages() {
    try {
      this.isMessageListLoading = true;
      const messages = await ChatService.getChatMessages(this.selectedChat.id);
      this.messageList = messages;
    } catch {
      this.errors.push({
        id: v4(),
        message: "Ошибка получения сообщений",
      });
    } finally {
      this.isMessageListLoading = false;
    }
  }

  async setRepliedMessage(messageId: string) {
    const message =
      this.messageList.find(({ id }) => id === messageId) ??
      this.commentList.find(({ id }) => id === messageId);

    if (message) {
      this.repliedMessage = message;
    }
  }

  async unsetRepliedMessage() {
    this.repliedMessage = null;
  }

  async setCommentedMessage(messageId: string) {
    const message = this.messageList.find(({ id }) => id === messageId);

    if (message) {
      this.commentedMessage = message;
    }
  }

  async unsetCommentedMessage() {
    this.commentedMessage = null;
  }

  async resentMessage(messageId: string) {
    const message = this.messageList?.find((msg) => msg.id === messageId);

    if (message) {
      $socket.emit(ChatEvent.CREATE_MESSAGE, {
        text: message.text,
        chatId: message.chatId,
        repliedToId: message.repliedToId ?? null,
        clientId: messageId,
      });
      this.messageList = this.messageList.map((msg) => {
        if (msg.id === message.id) {
          return { ...message, status: MessageStatus.PENDING };
        }

        return msg;
      });
    }
  }

  async createMessage(paylod: CreateMessagePayload) {
    const chatId = this.selectedChat.id;
    const clientId = v4();

    $socket.emit(ChatEvent.CREATE_MESSAGE, {
      ...paylod,
      chatId,
      clientId,
      repliedToId: this.repliedMessage?.id ?? null,
      rootId: this.commentedMessage?.id ?? null,
    });

    if (this.commentedMessage === null) {
      this.messageList = [
        {
          id: clientId,
          chatId: chatId,
          userId: this.myId,
          simpleUser: {
            name: this.profile.name,
            avatar: this.profile.avatar,
            id: this.myId,
            label: this.profile.label,
          },
          type: MessageType.DEFAULT,
          status: MessageStatus.PENDING,
          text: paylod.text,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          deletedAt: null,
          files: [],
          isUpdated: false,
          readersIds: [],
          repliedTo: this.repliedMessage,
          repliedToId: this.repliedMessage?.id ?? null,
          rootId: null,
        },
        ...this.messageList,
      ];

      this.chatList = this.chatList.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, lastMessage: paylod.text };
        }

        return chat;
      });

      this.favoriteChatList = this.favoriteChatList.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, lastMessage: paylod.text };
        }

        return chat;
      });
    } else {
      this.commentList = [
        {
          id: clientId,
          chatId: chatId,
          userId: this.myId,
          simpleUser: {
            name: this.profile.name,
            avatar: this.profile.avatar,
            id: this.myId,
            label: this.profile.label,
          },
          type: MessageType.DEFAULT,
          status: MessageStatus.PENDING,
          text: paylod.text,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          deletedAt: null,
          files: [],
          isUpdated: false,
          readersIds: [],
          repliedTo: this.repliedMessage,
          repliedToId: this.repliedMessage?.id ?? null,
          rootId: this.commentedMessage.id,
        },
        ...this.commentList,
      ];

      this.messageList = this.messageList.map((msg) => {
        if (msg.id === this.commentedMessage.id) {
          return { ...msg, commentsCount: msg.commentsCount + 1 };
        }

        return msg;
      });

      this.commentedMessage = {
        ...this.commentedMessage,
        commentsCount: this.commentedMessage.commentsCount + 1,
      };
    }

    this.repliedMessage = null;

    setTimeout(() => {
      if (this.commentedMessage === null) {
        const message = this.messageList.find(({ id }) => id === clientId);
        if (message && message.status === MessageStatus.PENDING) {
          this.messageList = this.messageList.map((msg) => {
            if (msg.id === message.id) {
              return { ...msg, status: MessageStatus.ERROR };
            }

            return msg;
          });
        }
      } else {
        const comment = this.commentList.find(({ id }) => id === clientId);
        if (comment && comment.status === MessageStatus.PENDING) {
          this.commentList = this.commentList.map((msg) => {
            if (msg.id === comment.id) {
              return { ...msg, status: MessageStatus.ERROR };
            }

            return msg;
          });
        }
      }
    }, 5_000);
  }

  async getMessageComments() {
    try {
      this.isMessageCommentsLoading = true;
      const comments = await ChatService.getMessageComments(
        this.commentedMessage.id
      );
      this.commentList = comments;
    } catch {
      this.errors.push({
        id: v4(),
        message: "Ошибка получения комментариев",
      });
    } finally {
      this.isMessageCommentsLoading = false;
    }
  }

  async removeMessage(messageId: string) {
    const isComment = !!this.commentedMessage;

    $socket.emit(ChatEvent.DELETE_MESSAGE, {
      id: messageId,
      chatId: this.selectedChat.id,
      isComment,
    }, {
      
    });

    if (isComment) {
      this.commentList = this.commentList.map((msg) => {
        if (msg.id === messageId) {
          return { ...msg, status: MessageStatus.PENDING };
        }

        return msg;
      });
      return;
    }

    this.messageList = this.messageList.map((msg) => {
      if (msg.id === messageId) {
        return { ...msg, status: MessageStatus.PENDING };
      }

      return msg;
    });

    setTimeout(() => {
      if (!isComment) {
        const message = this.messageList.find(({ id }) => id === messageId);
        if (message && message.status === MessageStatus.PENDING) {
          this.messageList = this.messageList.map((msg) => {
            if (msg.id === message.id) {
              return { ...msg, status: MessageStatus.ERROR };
            }

            return msg;
          });
        }
      } else {
        const comment = this.commentList.find(({ id }) => id === messageId);
        if (comment && comment.status === MessageStatus.PENDING) {
          this.commentList = this.commentList.map((msg) => {
            if (msg.id === comment.id) {
              return { ...msg, status: MessageStatus.ERROR };
            }

            return msg;
          });
        }
      }
    }, 5_000);
  }

  private updateChatPosition(chatId: string) {
    const chat = this.chatList.find((chat) => chat.id === chatId);

    if (chat) {
      this.chatList = this.chatList.filter((chat) => chat.id !== chatId);
      this.chatList = [chat, ...this.chatList];
    }
  }
}

const store = new Store();
const StoreContext = createContext<Store>(store);

export { Store, StoreContext };
