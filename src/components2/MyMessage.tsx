import { Avatar, Typography } from "antd";
import React, { FC } from "react";

const MyMessage: FC<{ name: string; date: string; text: string }> = ({
  name,
  date,
  text,
}) => {
  return (
    <div
      style={{
        justifyContent: "flex-end",
        backgroundColor: "#e6f4ff",
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "start" }}>
        <div style={{ display: "block", flex: 8 }}>
          <div style={{ marginBottom: 5, textAlign: "end" }}>{name}</div>
          <div style={{ textAlign: "end", width: "100%" }}>
            <Typography.Text>{text}</Typography.Text>
          </div>
        </div>
        <div style={{ marginLeft: 10 }}>
          <Avatar size={30}>{name[0]}</Avatar>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Typography.Text type="secondary" style={{ fontSize: 10 }}>
            {new Date(date).toLocaleString("ru")}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default MyMessage;
