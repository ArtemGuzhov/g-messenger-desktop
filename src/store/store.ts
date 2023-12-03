import { makeAutoObservable } from "mobx";
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
  MessageInviteStatus,
  MessageStatus,
  MessageType,
  User,
} from "./store-additional";
import { ChatService } from "../services/ChatService";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants";

class Store {
  private $socket = io(SOCKET_URL, {
    extraHeaders: {
      Authorization: localStorage.getItem("accessToken"),
    },
    autoConnect: false,
  });

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
  chatUserList: User[] = [];
  isChatUserListLoading = false;

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

  userInvitedId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { deep: true });
  }

  setupSocket() {
    this.$socket = io(SOCKET_URL, {
      extraHeaders: {
        Authorization: localStorage.getItem("accessToken"),
      },
    });
  }

  connect() {
    this.$socket.connect();

    this.$socket.on(ChatEvent.CREATED_CHAT, (chat: Chat) => {
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

    this.$socket.on(
      ChatEvent.CREATED_MESSAGE,
      async (payload: {
        chatId: string;
        clientId: string;
        message: Message;
      }) => {
        if (!payload.message.rootId) {
          if (payload.message.userId !== this.myId) {
            if (this.selectedChat?.id === payload.chatId) {
              this.messageList = [payload.message, ...this.messageList];
            }

            this.chatList = this.chatList.map((chat) => {
              if (chat.id === payload.chatId) {
                return { ...chat, lastMessage: payload.message.text };
              }
              return chat;
            });
          } else {
            if (payload.message.inviteChat) {
              this.chatList = this.chatList.map((chat) => {
                if (chat.id === payload.chatId) {
                  return { ...chat, lastMessage: payload.message.text };
                }
                return chat;
              });
            } else {
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
                    repliedTo: {
                      ...payload.message.repliedTo,
                      ...msg.repliedTo,
                    },
                  };
                }

                return msg;
              });
            }
          }
          this.updateChatPosition(payload.chatId);
        } else {
          if (
            payload.message.userId !== this.myId &&
            this.selectedChat?.id === payload.chatId
          ) {
            this.commentList = [payload.message, ...this.commentList];
            this.messageList = this.messageList.map((msg) => {
              if (msg.id === payload.message.rootId) {
                return { ...msg, commentsCount: msg.commentsCount + 1 };
              }
              return msg;
            });

            if (this.commentedMessage?.id === payload.message.rootId) {
              this.commentedMessage = {
                ...this.commentedMessage,
                commentsCount: this.commentedMessage.commentsCount + 1,
              };
            }

            return;
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
      }
    );

    this.$socket.on(
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

    this.$socket.on(ChatEvent.IS_EXIST_CHAT, (payload: { chatId: string }) => {
      const chat = this.chatList.find((chat) => chat.id === payload.chatId);

      if (chat) {
        this.selectedChat = chat;
      }
    });

    this.$socket.on(
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

    this.$socket.on(ChatEvent.INVITE_ERROR, (payload: { clientId: string }) => {
      if (this.userInvitedId === payload.clientId) {
        this.userInvitedId = null;
        this.errors = [
          ...this.errors,
          {
            id: v4(),
            message: "Ошибка при приглашении пользователя",
          },
        ];
      }
    });

    this.$socket.on(
      ChatEvent.INVITE_SENT,
      (payload: { clientId: string; profile: User }) => {
        if (this.userInvitedId === payload.clientId) {
          this.userInvitedId = null;
          this.chatUserList = [...this.chatUserList, payload.profile];
        }
      }
    );

    this.$socket.on(
      ChatEvent.ACCEPT_INVITE,
      (payload: {
        chatId: string;
        messageId?: string;
        simpleUser?: User;
        userId?: string;
        chat?: Chat;
      }) => {
        if (payload.simpleUser) {
          if (this.selectedChat?.id === payload.chatId) {
            this.selectedChat = {
              ...this.selectedChat,
              usersCount: this.selectedChat.usersCount + 1,
            };

            this.chatUserList = [...this.chatUserList, payload.simpleUser];
          }

          this.chatList = this.chatList.map((chat) => {
            if (chat.id === payload.chatId) {
              return {
                ...chat,
                usersCount: this.selectedChat.usersCount + 1,
              };
            }

            return chat;
          });
          return;
        }

        if (payload.messageId && payload.chat) {
          if (this.selectedChat?.id === payload.chatId) {
            this.messageList = this.messageList.map((msg) => {
              if (msg.id === payload.messageId) {
                return { ...msg, inviteStatus: MessageInviteStatus.ACCEPTED };
              }
            });
          }

          if (payload.userId === this.myId) {
            this.chatList = [payload.chat, ...this.chatList];
          }
        }
      }
    );

    this.$socket.on(
      ChatEvent.REJECT_INVITE,
      (payload: { chatId: string; messageId: string; userId?: string }) => {
        if (payload.userId) {
          if (this.selectedChat?.id === payload.chatId) {
            this.chatUserList = this.chatUserList.filter(
              (user) => user.id !== payload.userId
            );
          }

          return;
        }

        if (this.selectedChat?.id === payload.chatId) {
          this.messageList = this.messageList.map((msg) => {
            if (msg.id === payload.messageId) {
              return { ...msg, inviteStatus: MessageInviteStatus.REJECTED };
            }

            return msg;
          });
        }
      }
    );
  }

  async init() {
    try {
      this.isInitLoading = true;
      await this.getProfile();
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
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка при авторизации",
        },
      ];
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
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка при авторизации",
        },
      ];
    } finally {
      this.isAuthLoading = false;
    }
  }

  async logout() {
    try {
      this.isAuthLoading = true;
      await AuthService.logout();
      this.$socket.disconnect();
      this.isAuth = false;
      this.profile = null;
      this.selectedChat = null;
      this.messageList = [];
      this.repliedMessage = null;
      this.commentedMessage = null;
      localStorage.setItem("accessToken", null);
      localStorage.setItem("refreshToken", null);
    } catch (error) {
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка при выходе",
        },
      ];
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
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка получения профиля",
        },
      ];
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
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка получения пользователей",
        },
      ];
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
        await this.getUserChats();
        return;
      }

      const chat = this.chatList.find((chat) => chat.id === chatId);

      this.favoriteChatIds = [...this.favoriteChatIds, chatId];
      this.chatList = this.chatList.filter((chat) => chat.id !== chatId);
      this.favoriteChatList = [
        ...this.favoriteChatList,
        { ...chat, isFavorite: true },
      ];
      this.selectedChat = { ...this.selectedChat, isFavorite: true };
    } catch (error) {
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка изменения чата",
        },
      ];
    }
  }

  /**
   * Chats
   */

  async getChatUsers() {
    try {
      this.isChatUserListLoading = true;

      const users = await ChatService.getChatUsers(this.selectedChat?.id);
      this.chatUserList = users;
    } catch (error) {
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка получения пользователей чата",
        },
      ];
    } finally {
      this.isChatUserListLoading = false;
    }
  }

  async getUserChats(isInit?: boolean) {
    try {
      this.isChatListLoading = true;
      const chats = await ChatService.getChats();

      if (this.profile) {
        const favoriteChatList: Chat[] = [];
        const chatList: Chat[] = [];

        for (let chat of chats) {
          const isFavorite = !!this.favoriteChatIds.includes(chat.id);

          if (chat.type === ChatType.DIALOG) {
            const profile = chat.users.filter(
              (user) => user.id !== this.myId
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
      }
    } catch (error) {
      if (!isInit) {
        this.errors = [
          ...this.errors,
          {
            id: v4(),
            message: "Ошибка получения чатов",
          },
        ];
      }
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
    this.$socket.emit(ChatEvent.CREATE_CHAT, payload);
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
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка получения сообщений",
        },
      ];
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
      this.$socket.emit(ChatEvent.CREATE_MESSAGE, {
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

  async createMessage(payload: CreateMessagePayload) {
    const chatId = this.selectedChat.id;
    const clientId = v4();

    this.$socket.emit(ChatEvent.CREATE_MESSAGE, {
      ...payload,
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
          text: payload.text,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          deletedAt: null,
          files: [],
          isUpdated: false,
          readersIds: [],
          repliedTo: this.repliedMessage,
          repliedToId: this.repliedMessage?.id ?? null,
          rootId: null,
          inviteChat: null,
          inviteChatId: null,
          inviteStatus: null,
        },
        ...this.messageList,
      ];

      this.chatList = this.chatList.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, lastMessage: payload.text };
        }

        return chat;
      });

      this.favoriteChatList = this.favoriteChatList.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, lastMessage: payload.text };
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
          text: payload.text,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          deletedAt: null,
          files: [],
          isUpdated: false,
          readersIds: [],
          repliedTo: this.repliedMessage,
          repliedToId: this.repliedMessage?.id ?? null,
          rootId: this.commentedMessage.id,
          inviteChat: null,
          inviteChatId: null,
          inviteStatus: null,
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
      this.errors = [
        ...this.errors,
        {
          id: v4(),
          message: "Ошибка получения комментариев",
        },
      ];
    } finally {
      this.isMessageCommentsLoading = false;
    }
  }

  async removeMessage(messageId: string) {
    const isComment = !!this.commentedMessage;

    this.$socket.emit(ChatEvent.DELETE_MESSAGE, {
      id: messageId,
      chatId: this.selectedChat.id,
      isComment,
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

  async inviteUser(profileId: string, inviteChatId: string) {
    const clientId = v4();

    this.$socket.emit(ChatEvent.INVITE_USER, {
      profileId,
      inviteChatId,
      clientId,
    });

    this.userInvitedId = clientId;
  }

  async answerOnInvite(payload: {
    inviteChatId: string;
    inviteStatus: MessageInviteStatus;
    messageId: string;
  }) {
    this.$socket.emit(ChatEvent.ANSWER_ON_INVITE, {
      ...payload,
      chatId: this.selectedChat.id,
    });
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
