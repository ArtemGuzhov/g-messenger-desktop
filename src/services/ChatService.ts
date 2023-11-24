import $api from "../http";
import { Chat } from "../store/store-additional";

export class ChatService {
  static async getChats(): Promise<Chat[]> {
    const { data: response } = await $api.get("/api/v1/chats");
    return response.data;
  }
}
