import { TeamOutlined } from "@ant-design/icons";
import { Avatar, Tag, Typography } from "antd";
import React, { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Chat, ChatType } from "../store/store-additional";
import { StoreContext } from "../store/store";
import { AvatarWithImage } from "./AvatarWithImage";

export const ChatItem: FC<Chat> = observer(
  ({ id, name, isNotReadMessagesCount, label, type, lastMessage, avatar }) => {
    const store = useContext(StoreContext);

    return (
      <div
        className="chat-item"
        style={{
          display: "flex",
          cursor: "pointer",
          height: "68px",
          backgroundColor:
            store.selectedChat?.id === id ? "#565570" : "#444375",
        }}
        onClick={() => store.setChat(id)}
      >
        <div
          style={{
            padding: "10px 0",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "46px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                height: 10,
                width: 10,
                borderRadius: 10,
                backgroundColor: "#C94E4E",
                visibility: isNotReadMessagesCount ? "visible" : "hidden",
              }}
            ></div>
          </div>
          <div style={{ width: 45 }}>
            {avatar ? (
              <AvatarWithImage
                size={45}
                alt={`chat-avatar-item-${id}`}
                fileId={avatar.id}
                title={name[0]}
              />
            ) : (
              <Avatar size={45} alt={`chat-avatar-item-${id}`}>
                {name[0]}
              </Avatar>
            )}
          </div>
          <div style={{ marginLeft: "10px", width: "165px" }}>
            <div>
              <Typography.Text style={{ color: "#fff", fontSize: 16 }} strong>
                {name}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text style={{ color: "#A7ADB4" }}>
                {lastMessage
                  ? lastMessage
                  : store.messageList.length
                  ? "Сообщение удалено"
                  : "Нет сообщений"}
              </Typography.Text>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "60px",
            }}
          >
            {type === ChatType.GROUP ? (
              <Tag
                style={{ backgroundColor: "#f1f1f1" }}
                icon={<TeamOutlined />}
              >
                {label}
              </Tag>
            ) : (
              <Tag color="blue">{label}</Tag>
            )}
          </div>
        </div>
      </div>
    );
  }
);
