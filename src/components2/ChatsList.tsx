/* eslint-disable @typescript-eslint/no-empty-function */
import { Avatar, List, Tag } from "antd";
import React, { useContext, useEffect } from "react";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";
import { MessageOutlined } from "@ant-design/icons";

const ChatsList = () => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.getChats();
  }, []);

  useEffect(() => {}, [store.chat.selectedChat]);

  return (
    <div
      id="scrollableChatList"
      style={{
        height: "95%",
        overflow: "auto",
      }}
    >
      <List
        dataSource={store.chat.list}
        loading={store.chat.isLoadingList}
        renderItem={(chat) => (
          <List.Item
            key={`chat-item-${chat.id}`}
            className={
              store.chat.selectedChat?.id === chat.id ? "chat-selected" : "chat"
            }
            style={{
              padding: "5px 10px",
              position: "relative",
              zIndex: 1,
            }}
            onClick={() => store.selectChat(chat.id)}
          >
            <List.Item.Meta
              avatar={<Avatar>{chat.name ? chat.name[0] : ""}</Avatar>}
              title={<a>{chat.name}</a>}
              description={
                chat.messages?.length
                  ? chat.messages[0]?.text
                  : "Пока нет сообщений"
              }
            />
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 2,
              }}
            >
              <Tag
                color="error"
                style={{
                  right: 0,
                  top: 0,
                  position: "absolute",
                  borderTopWidth: 0,
                  borderTopLeftRadius: 0,
                  visibility: chat?.isNotReadMessagesCount
                    ? "visible"
                    : "hidden",
                }}
              >
                {chat?.isNotReadMessagesCount ?? 0}
              </Tag>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default observer(ChatsList);
