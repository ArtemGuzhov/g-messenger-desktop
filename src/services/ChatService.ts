import $api from "../http";
import { Chat, Message } from "../store/store-additional";

export class ChatService {
  static async getChats(): Promise<Chat[]> {
    const { data: response } = await $api.get("/api/v1/chats");
    return response.data;
  }

  static async getChatMessages(chatId: string): Promise<Message[]> {
    const { data: response } = await $api.get(`/api/v1/messages/${chatId}`);
    return response.data;
  }
}
