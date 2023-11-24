import React, { FC, useContext, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageTypings } from "./ChatMessageTypings";
import { ChatMessageList } from "./ChatMessageList";
import { ReplyMessageModal } from "./ReplyMessageModal";
import { MessageCommentsModal } from "./MessageCommentsModal";
import { Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { StoreContext } from "../store/store";

export const CurrentChat: FC = () => {
  const store = useContext(StoreContext);
  const [totalHeight, setTotalHeight] = useState(151);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const onReplyMsg = () => {
    setIsReplyModalOpen(false);
  };

  const onSetRepliedMsg = () => {
    setIsReplyModalOpen(true);
  };

  const onOpenComments = () => {
    setIsCommentModalOpen(true);
  };

  return (
    <div>
      <ChatHeader chat={store.selectedChat} />
      {store.repliedMessage !== null && (
        <ReplyMessageModal
          isOpen={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          onReply={onReplyMsg}
          repliedMessage={store.repliedMessage}
        />
      )}
      {store.commentedMessage !== null && (
        <MessageCommentsModal
          onClose={() => setIsCommentModalOpen(false)}
          isOpen={isCommentModalOpen}
          commentedMessage={store.commentedMessage}
          onSetRepliedMsg={onSetRepliedMsg}
        />
      )}
      <ChatMessageList
        differenceHeight={totalHeight}
        onSetRepliedMsg={onSetRepliedMsg}
        onOpenComments={onOpenComments}
      />
      {/* <div
        style={{
          height: "25px",
          paddingLeft: "70px",
          display: "flex",
          alignItems: "end",
        }}
      >
        <div style={{ marginRight: "10px" }}>
          <EditOutlined />
        </div>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Артем Гужов набирает сообщение...
        </Typography.Text>
      </div> */}
      <ChatMessageTypings setTotalHeight={setTotalHeight} />
    </div>
  );
};
