import React, { FC } from "react";
import { ChatItem } from "./ChatItem";
import { Chat } from "../store/store-additional";
import { observer } from "mobx-react-lite";

export const ChatList: FC<{ chats: Chat[] }> = observer(({ chats }) => {
  return (
    <div>
      {chats.map((chat) => (
        <ChatItem key={chat.id} {...chat} />
      ))}
    </div>
  );
});
