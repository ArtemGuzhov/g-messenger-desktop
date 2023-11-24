import React, { FC } from "react";
import { ChatItem } from "./ChatItem";
import { Chat } from "../store/store-additional";

export const ChatList: FC<{ chats: Chat[] }> = ({ chats }) => {
  return (
    <div>
      {chats.map(() => (
        <ChatItem />
      ))}
    </div>
  );
};
