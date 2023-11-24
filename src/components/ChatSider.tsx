import React, { FC, useContext } from "react";
import { ChatSiderHeader } from "./ChatSiderHeader";
import { Divider, Switch, Typography } from "antd";
import { FavoriteChatList } from "./FavoriteChatList";
import { ChatTools } from "./ChatTools";
import { ChatList } from "./ChatList";
import { StoreContext } from "../store/store";

export const ChatSider: FC = () => {
  const store = useContext(StoreContext);

  return (
    <div
      style={{
        width: "300px",
        background: "#444375",
      }}
    >
      <ChatSiderHeader />
      <div style={{ overflow: "auto", height: "calc(100vh - 60px)" }}>
        <div style={{ padding: "30px 10px 0px 20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{ flex: 2, display: "flex", justifyContent: "flex-start" }}
            >
              <Typography.Text style={{ color: "#A7ADB4", fontSize: 14 }}>
                НЕПРОЧИТАННЫЕ
              </Typography.Text>
            </div>
            <div
              style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
            >
              <Switch />
            </div>
          </div>
          <Divider
            style={{
              backgroundColor: "#bebcf5",
              padding: 0,
              margin: "3px 0 10px 0",
            }}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <FavoriteChatList />
        </div>
        <div style={{ marginTop: "20px" }}>
          <ChatTools />
        </div>
        <div style={{ marginTop: "20px" }}>
          <ChatList chats={store.chatList} />
        </div>
      </div>
    </div>
  );
};
