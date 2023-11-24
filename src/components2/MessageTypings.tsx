import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import React, { FC, useContext, useState } from "react";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";
import TextArea from "antd/es/input/TextArea";

const MessageTyping: FC = () => {
  const store = useContext(StoreContext);

  const items: MenuProps["items"] = [];

  const [message, setMessage] = useState({
    text: "",
  });

  const onCreateMessage = () => {
    store.createMessage({ ...message, chatId: store.chat.selectedChat.id });
    setMessage({
      text: "",
    });
  };

  const handleKeyPress = (key: string) => {
    if (key === "Enter") {
      onCreateMessage();
    }
  };

  return (
    <div
      style={{
        height: 90,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 10px",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Dropdown
          menu={{ items }}
          placement="topLeft"
          arrow={{ pointAtCenter: true }}
        >
          <Button icon={<PaperClipOutlined />} type="text" size="large" />
        </Dropdown>
      </div>
      <div style={{ flex: 10, display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", display: "flex" }}>
          <TextArea
            allowClear
            style={{
              resize: "none",
              height: 70,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRightWidth: 0,
            }}
            onChange={(e) =>
              setMessage({
                ...message,
                text: e.target.value,
              })
            }
            value={message.text}
            onKeyDown={(e) => handleKeyPress(e.key)}
          />
          <div style={{ width: 40 }}>
            <Button
              icon={<SendOutlined />}
              size="large"
              onClick={onCreateMessage}
              style={{
                height: "100%",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(MessageTyping);
