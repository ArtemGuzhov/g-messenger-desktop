import { Avatar, Modal, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { FC, useState } from "react";
import { Message } from "../store/store-additional";
import { observer } from "mobx-react-lite";
import { getMessageTime } from "../helpers";

export const ReplyMessageModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onReply: (text: string) => void;
  repliedMessage: Message;
}> = observer(({ isOpen, onClose, onReply, repliedMessage }) => {
  const [text, setText] = useState("");

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Ответить на сообщение"
      onOk={() => onReply(text)}
      okText="Ответить"
      cancelText="Отмена"
      okButtonProps={{ disabled: !text }}
    >
      <div
        style={{
          display: "flex",
          marginTop: 10,
          border: "1px solid #a7adb4",
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderBottom: 0,
        }}
      >
        <div
          style={{
            width: "60px",
            display: "flex",
            justifyContent: "center",
            paddingLeft: "20px",
          }}
        >
          <Avatar size="large" />
        </div>
        <div style={{ width: "100vw - 380px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong>
              {repliedMessage.simpleUser.name}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11, marginLeft: 10 }}
            >
              {getMessageTime(repliedMessage.createdAt)}
            </Typography.Text>
          </div>
          <Typography.Paragraph
            style={{
              maxHeight: "200px",
              overflow: "auto",
            }}
          >
            {repliedMessage.text ?? ""}
          </Typography.Paragraph>
        </div>
      </div>
      <TextArea
        style={{ marginTop: "20px", resize: "none", height: "80px" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Modal>
  );
});
