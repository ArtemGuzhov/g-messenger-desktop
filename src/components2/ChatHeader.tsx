import { PushpinOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Typography } from "antd";
import React, { useContext, useState } from "react";
import { StoreContext } from "../store/store";
import { getOnlineTime } from "../helpers";
import { observer } from "mobx-react-lite";

const ChatHeader = () => {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const store = useContext(StoreContext);

  const onAttach = () => {
    store.attachChat(store.chat.selectedChat.id);
  };

  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        height: 38,
        alignItems: "center",
        padding: "0 10px",
      }}
    >
      {isSearch ? (
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div style={{ flex: 6 }}>
            <Input
              size="large"
              placeholder="Поиск по истории сообщений"
              prefix={<SearchOutlined />}
              bordered={false}
            />
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <Button type="primary">Поиск</Button>
            <Button
              style={{ marginLeft: 10 }}
              type="dashed"
              onClick={() => setIsSearch(false)}
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flex: 6 }}>
            <div style={{ flex: 1 }}>
              <Typography.Text strong style={{ marginRight: 20 }}>
                {store.chat.selectedChat.name}
              </Typography.Text>
              {store.chat.selectedChat.users.find(
                ({ id }) => id !== store.user.profile.id
              ).isOnline ? (
                <Typography.Text type="secondary">Онлайн</Typography.Text>
              ) : (
                <Typography.Text type="secondary">
                  {`был в сети ${getOnlineTime(
                    store.chat.selectedChat.users.find(
                      ({ id }) => id !== store.user.profile.id
                    ).onlineAt
                  )} назад`}
                </Typography.Text>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flex: 1 }}>
            <div style={{ flex: 1 }}>
              {/* <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={() => setIsSearch(true)}
              /> */}
            </div>
            <div style={{ flex: 1 }}>
              <Button
                type="text"
                icon={<PushpinOutlined />}
                loading={store.chat.isAttachChatLoading}
                onClick={onAttach}
              />
            </div>
            <div style={{ display: "flex", flex: 6, justifyContent: "center" }}>
              <Avatar
                size={30}
                style={{
                  borderColor: "#fff",
                }}
              >
                {store.chat.selectedChat.name[0]}
              </Avatar>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default observer(ChatHeader);
