import { TeamOutlined } from "@ant-design/icons";
import { Avatar, Tag, Typography } from "antd";
import React, { FC } from "react";

export const ChatItem: FC = () => {
  return (
    <div
      className="chat-item"
      style={{ display: "flex", cursor: "pointer", height: "68px" }}
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
            }}
          ></div>
        </div>
        <div style={{ width: 45 }}>
          <Avatar size={45} />
        </div>
        <div style={{ marginLeft: "10px", width: "165px" }}>
          <div>
            <Typography.Text style={{ color: "#fff", fontSize: 16 }} strong>
              Новый чат
            </Typography.Text>
          </div>
          <div>
            <Typography.Text style={{ color: "#A7ADB4" }}>
              Новое сообщение
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
          <Tag style={{ backgroundColor: "#f1f1f1" }} icon={<TeamOutlined />}>
            12
          </Tag>
        </div>
      </div>
    </div>
  );
};
