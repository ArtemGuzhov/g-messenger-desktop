import { Avatar, Typography } from "antd";
import React, { FC } from "react";
import { getMessageTime } from "../helpers";
import { Message } from "../store/store-additional";

const ReplyMessage: FC<{ reply: Message }> = ({ reply }) => {
  return (
    <div
      style={{
        display: "flex",
        cursor: "pointer",
        position: "relative",
        border: "1px solid black",
        borderWidth: 0,
        borderLeftWidth: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginLeft: 2,
        }}
      >
        <Avatar size="large">{reply.user.name[0]}</Avatar>
      </div>
      <div style={{ width: "100%", padding: "0 10px" }}>
        <div
          style={{
            display: "flex",
          }}
        >
          <div>
            <Typography.Text strong>{reply.user.name}</Typography.Text>
          </div>
          <div
            style={{
              marginLeft: 10,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              {getMessageTime(reply.createdAt)}
            </Typography.Text>
          </div>
        </div>
        <div>
          <Typography.Text>{reply.text}</Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default ReplyMessage;
