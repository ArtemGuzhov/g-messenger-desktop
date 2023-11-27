import {
  SearchOutlined,
  StarOutlined,
  StarTwoTone,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Typography } from "antd";
import React, { FC, useContext } from "react";
import { Chat, ChatType } from "../store/store-additional";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store/store";

export const ChatHeader: FC<{
  chat: Chat | null;
}> = observer(({ chat }) => {
  const store = useContext(StoreContext);

  return (
    <div
      style={{
        height: "60px",
        width: "calc(100vw-300px)",
        border: "1px solid #a7adb4",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        display: "flex",
        alignItems: "center",
        padding: "0 0 0 40px",
      }}
    >
      <div>
        <Avatar size="large" />
      </div>
      <div style={{ marginLeft: 10 }}>
        <Typography.Text style={{ fontSize: 16 }} strong>
          {chat.name}
        </Typography.Text>
      </div>
      <Divider
        type="vertical"
        style={{ backgroundColor: "#A7ADB4", height: "25px", margin: "0 15px" }}
      />
      <div>
        <Button
          icon={
            chat.isFavorite ? (
              <StarTwoTone twoToneColor="orange" />
            ) : (
              <StarOutlined />
            )
          }
          style={{ marginRight: 10 }}
          type="text"
          size="large"
          onClick={() => store.addOrDelFavoriteChat(chat.id)}
        />
      </div>
      <div>
        <Button
          icon={<SearchOutlined twoToneColor="#A7ADB4" />}
          style={{ marginRight: 10 }}
          type="text"
          size="large"
        />
      </div>
      {chat.type === ChatType.GROUP && (
        <div>
          <Button
            icon={<TeamOutlined twoToneColor="#A7ADB4" />}
            type="text"
            size="large"
          >
            {chat.usersCount ?? 0}
          </Button>
        </div>
      )}
    </div>
  );
});
