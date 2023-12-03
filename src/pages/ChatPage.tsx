import React, { FC, useContext, useEffect } from "react";
import { ChatSider } from "../components/ChatSider";
import { CurrentChat } from "../components/CurrentChat";
import "../css/chat-page.css";
import { NotificationInstance } from "antd/es/notification/interface";
import { MessageInstance } from "antd/es/message/interface";
import { StoreContext } from "../store/store";
import { EmptyChatList } from "../components/EmptyChatList";
import { observer } from "mobx-react-lite";

export const ChatPage: FC<{
  $notification: NotificationInstance;
  $error: MessageInstance;
  notificationContext: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >;
  errorContext: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >;
}> = observer(
  ({ $notification, $error, notificationContext, errorContext }) => {
    const store = useContext(StoreContext);

    useEffect(() => {
      for (const n of store.notifications) {
        $notification.open({
          type: "info",
          description: n.title,
          message: n.message,
          placement: "topRight",
          duration: 3,
        });
        store.removeNotification(n.id);
      }
    }, [store.notifications]);

    useEffect(() => {
      for (const e of store.errors) {
        $error.open({
          type: "error",
          content: e.message,
          duration: 3,
        });
        store.removeError(e.id);
      }
    }, [store.errors]);

    useEffect(() => {
      if (!store.isInitLoading && store.profile === null) {
        store.init();
        store.setupSocket();
        store.connect();
      }
    }, []);

    return (
      <div style={{ display: "flex" }}>
        {errorContext}
        {notificationContext}
        <div style={{ height: "100vh", width: "300px" }}>
          <ChatSider />
        </div>
        {(!store.chatList.length &&
          !store.favoriteChatList.length &&
          store.selectedChat === null) ||
        store.selectedChat === null ? (
          <EmptyChatList />
        ) : (
          <div style={{ height: "100vh", width: "100%" }}>
            <CurrentChat />
          </div>
        )}
      </div>
    );
  }
);
