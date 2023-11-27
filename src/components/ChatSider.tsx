import React, { FC, useContext, useEffect, useState } from "react";
import { ChatSiderHeader } from "./ChatSiderHeader";
import { Divider, Spin, Switch, Typography } from "antd";
import { FavoriteChatList } from "./FavoriteChatList";
import { ChatTools } from "./ChatTools";
import { ChatList } from "./ChatList";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";

export const ChatSider: FC = observer(() => {
  const store = useContext(StoreContext);
  const [isSearch, setIsSearch] = useState(false);
  const [isNotRead, setIsNotRead] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    store.getUserChats(true);
  }, []);

  useEffect(() => {
    if (isSearch) {
      store.concateChats();
    }
  }, [isSearch]);

  useEffect(() => {
    store.setIsNotReadChats();
  }, [isNotRead]);

  useEffect(() => {
    if (isUpdate) {
      store.getUserChats();
    }
  }, [isUpdate]);

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
              <Switch
                checked={isNotRead}
                onChange={(e) =>
                  setIsNotRead((prev) => {
                    setIsUpdate(prev);
                    return e;
                  })
                }
              />
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
        {!isSearch && !isNotRead && (
          <div style={{ marginTop: "20px" }}>
            <FavoriteChatList />
          </div>
        )}
        <div style={{ marginTop: "20px" }}>
          <ChatTools isSearch={isSearch} setIsSearch={setIsSearch} />
        </div>
        <div style={{ marginTop: "20px" }}>
          {store.isChatListLoading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin />
            </div>
          ) : (
            <ChatList chats={store.chatList} />
          )}
        </div>
      </div>
    </div>
  );
});
