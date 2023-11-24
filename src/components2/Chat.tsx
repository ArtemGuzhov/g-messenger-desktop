import React, { useContext, useState } from "react";
import MyMessage from "./MyMessage";
import UserMessage from "./UserMessage";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";
import ReplyMessageModal from "./ReplyMessageModal";

const Chat = () => {
  const store = useContext(StoreContext);
  const [isOpenReplyModal, setIsOpenReplyModal] = useState(false);

  const onOpenReplyModal = (messageId: string) => {
    store.setReplyMessage(messageId);
    setIsOpenReplyModal(true);
  };

  const onReplyMessage = (text: string) => {
    setIsOpenReplyModal(false);
    store.replyMessage({
      chatId: store.chat.selectedChat.id,
      messageId: store.message.replyMessage.id,
      text,
    });
  };

  const onCloseReplyModal = () => {
    store.removeReplyMessage();
    setIsOpenReplyModal(false);
  };

  return (
    <div
      style={{
        height: "84%",
        width: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        padding: "0 10px 20px 10px",
      }}
    >
      {store.chat.selectedChat.messages.map((message, index) => (
        <UserMessage
          key={`message-item-${message.id}`}
          nextUserId={store.chat.selectedChat.messages[index + 1]?.userId}
          onOpenReplyModal={onOpenReplyModal}
          {...message}
        />
      ))}
      <ReplyMessageModal
        isOpenReplyModal={isOpenReplyModal && !!store.message.replyMessage}
        onCloseReplyModal={onCloseReplyModal}
        onReplyMessage={onReplyMessage}
      />
    </div>
  );
};

export default observer(Chat);
