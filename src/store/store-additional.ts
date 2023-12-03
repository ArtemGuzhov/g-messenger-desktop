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
  INVITE = "INVITE",
  LEAVE = "LEAVE",
}

export enum MessageStatus {
  PENDING = "PENDING",
  ERROR = "ERROR",
  OK = "OK",
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
  DELETE_MESSAGE = "delete-chat",
  DELETED_MESSAGE = "deleted-message",
  INVITE_USER = "invite-user",
  INVITE_SENT = "invite-sent",
  INVITE_ERROR = "invite-error",
  ACCEPT_INVITE = "accept-invite",
  REJECT_INVITE = "reject-invite",
  ANSWER_ON_INVITE = "answer-on-invite",
}

export enum MessageInviteStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
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
  isExpect?: boolean;
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
  rootId: string | null;
  inviteChatId: string | null;
  inviteChat: Chat | null;
  inviteStatus: MessageInviteStatus | null;
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
  creatorId: string;
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
