import { StarTwoTone } from "@ant-design/icons";
import { Typography } from "antd";
import React, { FC, useContext } from "react";
import { ChatList } from "./ChatList";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";

export const FavoriteChatList: FC = observer(() => {
  const store = useContext(StoreContext);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", padding: "0px 10px 0px 20px" }}>
        <StarTwoTone twoToneColor="#A7ADB4" />
        <Typography.Text
          style={{ fontSize: 14, color: "#A7ADB4", marginLeft: 5 }}
        >
          ИЗБРАННЫЕ
        </Typography.Text>
      </div>
      <div style={{ marginTop: "10px" }}>
        <ChatList chats={store.favoriteChatList} />
      </div>
    </div>
  );
});
