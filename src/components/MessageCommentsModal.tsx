import { Avatar, Divider, Modal, Typography } from "antd";
import React, { FC, useContext } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatMessageTypings } from "./ChatMessageTypings";
import { Message } from "../store/store-additional";
import { observer } from "mobx-react-lite";
import { getCommentsCountLabel, getMessageTime } from "../helpers";
import { StoreContext } from "../store/store";

export const MessageCommentsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSetRepliedMsg: (msgId: string) => void;
  commentedMessage: Message;
}> = observer(({ isOpen, onClose, commentedMessage, onSetRepliedMsg }) => {
  const store = useContext(StoreContext);

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
              <Typography.Text strong>
                {commentedMessage.simpleUser.name}
              </Typography.Text>
            </div>
            <div style={{ marginTop: 0, display: "flex", alignItems: "start" }}>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                {/* 27 октября 16:12 */}
                {getMessageTime(commentedMessage.createdAt)}
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
          {getCommentsCountLabel(commentedMessage.commentsCount)}
        </Typography.Text>
      </div>
      <div>
        <ChatMessageList
          height={40}
          onSetRepliedMsg={onSetRepliedMsg}
          differenceHeight={0}
          isMaxHeight={true}
          messages={store.commentList}
        />
      </div>
      <ChatMessageTypings />
    </Modal>
  );
});
