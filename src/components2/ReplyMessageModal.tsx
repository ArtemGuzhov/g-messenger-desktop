import { Modal } from "antd";
import React, { FC, useContext, useState } from "react";
import UserMessage from "./UserMessage";
import { StoreContext } from "../store/store";
import TextArea from "antd/es/input/TextArea";

const ReplyMessageModal: FC<{
  isOpenReplyModal: boolean;
  onCloseReplyModal: () => void;
  onReplyMessage: (text: string) => void;
}> = ({ isOpenReplyModal, onCloseReplyModal, onReplyMessage }) => {
  const store = useContext(StoreContext);
  const [message, setMessage] = useState("");

  return (
    <Modal
      title="Добавить ответ?"
      open={isOpenReplyModal}
      onOk={() => {
        setMessage("");
        onReplyMessage(message);
      }}
      onCancel={onCloseReplyModal}
      okText="Добавить"
      cancelText="Отмена"
    >
      <div>
        <UserMessage {...store.message.replyMessage} isNotInChat={true} />
      </div>

      <div
        style={{ display: "flex", alignItems: "center", padding: "5px 15px" }}
      >
        <TextArea
          allowClear
          style={{
            resize: "none",
            height: 70,
          }}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>
    </Modal>
  );
};

export default ReplyMessageModal;
