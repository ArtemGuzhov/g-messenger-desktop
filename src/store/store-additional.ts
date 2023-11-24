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
  AUDIO = "AUDIO",
  FILE = "FILE",
}

export enum MessageStatus {
  DELIVERED = "DELIVERED",
  ERROR = "ERROR",
  SEEN = "SEEN",
  SENDING = "SENDING",
  SENT = "SENT",
}

export enum ChatEvent {
  CREATE_CHAT = "create-chat",
  CREATED_CHAT = "created-chat",
  CREATE_GROUP_CHAT = "create-group-chat",
  CREATE_MESSAGE = "create-message",
  EDIT_MESSAGE = "edit-message",
  DELETE_MESSAGE = "delete-message",
  CREATED_MESSAGE = "created-message",
  EDITED_MESSAGE = "edited-message",
  DELETED_MESSAGE = "deleted-message",
  READ_MESSAGES = "read-messages",
  READED_MESSAGES = "readed-messages",
  TYPING_MESSAGE = "typing-message",
  USER_TYPING_MESSAGE = "user-typing-message",
  CHATS = "chats",
  DELETE_CHAT = "delete-chat",
  CLEAR_CHAT = "clear-chat",
  UPDATED_CHAT = "updated-chat",
  DELETED_CHAT = "deleted-chat",
  CLEARED_CHAT = "cleared-chat",
  BLOCK_CHAT = "block-chat",
  CHANGE_STATUSES_MESSAGES = "change-status-messages",
  CHANGED_STATUSES_MESSAGES = "changed-status-messages",
  ACTIVE_CHATS = "active-chats",
  REQUEST_CHATS = "request-chats",
  UNREADED_CHATS_COUNT = "unreaded-chats-count",
}

export interface SimpleFile {
  id: string;
  format: FileFormat;
  mimetype: string;
  cropId: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: SimpleFile | null;
  isOnline: boolean;
  onlineAt: string;
}

export interface Message {
  id: string;
  text: string;
  readersIds: string[];
  type: MessageType;
  status: MessageStatus;
  user: User;
  userId: string;
  chatId: string;
  files: SimpleFile[];
  createdAt: string;
  reply: Message | null;
  isRead?: boolean;
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
}
