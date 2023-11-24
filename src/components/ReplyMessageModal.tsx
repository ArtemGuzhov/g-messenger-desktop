import { Avatar, Modal, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { FC } from "react";
import { Message } from "../store/store-additional";

export const ReplyMessageModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onReply: () => void;
  repliedMessage: Message;
}> = ({ isOpen, onClose, onReply, repliedMessage }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Ответить на сообщение"
      onOk={onReply}
      okText="Ответить"
      cancelText="Отмена"
      okButtonProps={{ style: { backgroundColor: "#444375", color: "#fff" } }}
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
        <div style={{ width: "100vw - 380px", paddingLeft: "10px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong>Артем Гужов</Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11, marginLeft: 10 }}
            >
              16:12
            </Typography.Text>
          </div>
          <Typography.Paragraph
            style={{
              maxHeight: "200px",
              overflow: "auto",
            }}
          >{`
        ource: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[44990:1122/194007.191978:ERROR:CONSOLE(1)] "Request Storage.getStorageKeyForFrame failed. {"code":-32602,"message":"Frame tree node for given frame not found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[44990:1122/194009.976367:ERROR:CONSOLE(1)] "Request Storage.getStorageKeyForFrame failed. {"code":-32602,"message":"Frame tree node for given frame not found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[44990:1122/194009.976830:ERROR:CONSOLE(1)] "Request Storage.getStorageKeyForFrame failed. {"code":-32602,"message":"Frame tree node for given frame not found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[44990:1122/194009.980231:ERROR:CONSOLE(1)] "Request Storage.getStorageKeyForFrame failed. {"code":-32602,"message":"Frame tree node for given frame not found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[44990:1122/194009.980256:ERROR:CONSOLE(1)] "Request Storage.getStorageKeyForFrame failed. {"code":-32602,"message":"Frame tree node for given frame not found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[44990:1122/194009.980469:ERROR:CONSOLE(1)] "Request Storage.getStorageKeyForFrame failed. {"code":-32602,"message":"Frame tree node for given frame not found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[44990:1122/194009.980490:ERROR:CONSOLE(1)] "Request Storage.getStorageKeyForFrame failed. {"`}</Typography.Paragraph>
        </div>
      </div>
      <TextArea style={{ marginTop: "20px", resize: "none", height: "80px" }} />
    </Modal>
  );
};
