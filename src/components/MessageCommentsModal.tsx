import { Avatar, Divider, Modal, Typography } from "antd";
import React, { FC, useContext, useEffect } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatMessageTypings } from "./ChatMessageTypings";
import { Message } from "../store/store-additional";
import { observer } from "mobx-react-lite";
import { getCommentsCountLabel, getMessageTime } from "../helpers";
import { StoreContext } from "../store/store";
import { AvatarWithImage } from "./AvatarWithImage";

export const MessageCommentsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSetRepliedMsg: (msgId: string) => void;
  commentedMessage: Message;
}> = observer(({ isOpen, onClose, commentedMessage, onSetRepliedMsg }) => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.getMessageComments();
  }, [commentedMessage.id]);

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
          {commentedMessage?.simpleUser?.avatar ? (
            <AvatarWithImage
              fileId={commentedMessage.simpleUser.avatar.id}
              size="large"
              alt={`${commentedMessage.simpleUser.avatar.id}`}
              title={commentedMessage.simpleUser.name[0]}
            />
          ) : (
            <Avatar size="large">
              {commentedMessage?.simpleUser?.name[0]}
            </Avatar>
          )}
        </div>
        <div style={{ width: "100vw - 380px" }}>
          <div
            style={{ marginBottom: 0, display: "flex", alignItems: "center" }}
          >
            <div>
              <Typography.Text strong>
                {commentedMessage.simpleUser.name}
              </Typography.Text>
            </div>
            <div
              style={{
                marginTop: 0,
                display: "flex",
                alignItems: "start",
                marginLeft: "10px",
              }}
            >
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                {getMessageTime(commentedMessage.createdAt)}
              </Typography.Text>
            </div>
          </div>
          <Typography.Paragraph
            style={{
              maxHeight: "200px",
              overflow: "auto",
            }}
          >
            {commentedMessage?.text ?? ""}
          </Typography.Paragraph>
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
          isLoading={store.isMessageCommentsLoading}
          isComments={true}
        />
      </div>
      <ChatMessageTypings />
    </Modal>
  );
});
