import React, { useContext } from "react";
import ChatsSearch from "../components2/ChatsSearch";
import { Divider } from "antd";
import ChatsList from "../components2/ChatsList";
import Chat from "../components2/Chat";
import ChatHeader from "../components2/ChatHeader";
import MessageTyping from "../components2/MessageTypings";
import EmptyChats from "../components2/EmptyChats";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";

const ChatsPage = () => {
  const store = useContext(StoreContext);

  return (
    <div
      style={{
        display: "flex",
        height: `100%`,
      }}
    >
      <div
        style={{ flex: 1, height: "100%", borderRight: "1px solid #f1f1f1" }}
      >
        <ChatsSearch />
        <Divider style={{ padding: 0, margin: 0 }} />
        <ChatsList />
      </div>
      <div
        style={{
          flex: 3,
          height: "100%",
          marginBottom: 0,
          paddingBottom: 0,
        }}
      >
        {store.chat.selectedChat !== null ? (
          <>
            <ChatHeader />
            <Divider style={{ padding: 0, margin: 0 }} />
            <Chat />
            <Divider style={{ padding: 0, margin: 0 }} />
            <MessageTyping />
          </>
        ) : (
          <EmptyChats />
        )}
      </div>
    </div>
  );
};

export default observer(ChatsPage);
