import { Avatar, Divider, Modal, Typography } from "antd";
import React, { FC } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatMessageTypings } from "./ChatMessageTypings";
import { Message } from "../store/store-additional";

export const MessageCommentsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSetRepliedMsg: () => void;
  commentedMessage: Message;
}> = ({
  isOpen,
  onClose,
  // commentedMessage,
  onSetRepliedMsg,
}) => {
  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} width="50vw">
      <div
        style={{
          display: "flex",
          marginTop: 10,
        }}
      >
        <div
          style={{
            width: "60px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Avatar size="large" />
        </div>
        <div style={{ width: "100vw - 380px" }}>
          <div style={{ marginBottom: 0 }}>
            <div>
              <Typography.Text strong>Артем Гужов</Typography.Text>
            </div>
            <div style={{ marginTop: 0, display: "flex", alignItems: "start" }}>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                27 октября 16:12
              </Typography.Text>
            </div>
          </div>
          <Typography.Paragraph
            style={{
              maxHeight: "200px",
              overflow: "auto",
            }}
          >{`hello`}</Typography.Paragraph>
        </div>
      </div>
      <Divider style={{ margin: 0, padding: 0, marginBottom: "10px" }} />
      <div style={{ marginBottom: "10px" }}>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          3 комментария
        </Typography.Text>
      </div>
      <div>
        <ChatMessageList
          height={40}
          onSetRepliedMsg={onSetRepliedMsg}
          differenceHeight={0}
          isMaxHeight={true}
        />
      </div>
      <ChatMessageTypings />
    </Modal>
  );
};
