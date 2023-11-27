export enum FileFormat {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  APPLICATION = "APPLICATION",
}

export enum ChatType {
  DIALOG = "DIALOG",
  GROUP = "GROUP",
}

export enum MessageType {
  DEFAULT = "DEFAULT",
}

export enum MessageStatus {
  PENDING = "PENDING",
  ERROR = "ERROR",
  SENT = "SENT",
}

export enum ChatEvent {
  CREATE_CHAT = "create-chat",
  IS_EXIST_CHAT = "is-exist-chat",
  CREATED_CHAT = "created-chat",
  LEAVE_GROUP = "leave-group",
  LEFT_GROUP = "left-group",
  IS_NOT_READ_MESSAGES_COUNT = "is-not-read-messages-count",
  CREATE_MESSAGE_ERROR = "create-message-error",
  CREATE_MESSAGE = "create-message",
  CREATED_MESSAGE = "created-message",
}

export interface SimpleFile {
  id: string;
  format: FileFormat;
  mimetype: string;
  cropId: string | null;
}

export interface SimpleUser {
  id: string;
  avatar: SimpleFile | null;
  name: string;
  label: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  label: string;
  avatar: SimpleFile | null;
  isOnline: boolean;
  onlineAt: string;
  favoriteChatIds: string[];
  company: {
    name: string;
  };
}

export interface Message {
  id: string;
  text: string;
  readersIds: string[];
  type: MessageType;
  user?: User;
  status?: MessageStatus;
  userId: string;
  chatId: string;
  files: SimpleFile[];
  createdAt: string;
  isRead?: boolean;
  commentsCount?: number;
  deletedAt: string | null;
  isUpdated: boolean;
  repliedTo: Message | null;
  repliedToId: string | null;
  simpleUser: SimpleUser;
}

export interface Chat {
  id: string;
  name: string | null;
  type: ChatType;
  avatar: SimpleFile | null;
  messages: Message[];
  users: User[];
  isNotReadMessagesCount?: number;
  createdAt: string;
  isPersonal: boolean;
  usersCount?: number;
  label?: string;
  lastMessage?: string | null;
  isFavorite?: boolean;
}

export interface CreateChatPayload {
  name?: string;
  fileId?: string;
  userIds: string[];
}

export interface CreateMessagePayload {
  text?: string;
  fileIds?: string[];
}
