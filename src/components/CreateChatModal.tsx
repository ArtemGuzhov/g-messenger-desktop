import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Checkbox,
  Divider,
  Input,
  Modal,
  Typography,
  Upload,
} from "antd";
import React, { FC } from "react";

export const CreateChatModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}> = ({ isOpen, onClose, onCreate }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={onCreate}
      okText="Создать"
      cancelText="Отмена"
      okButtonProps={{ style: { backgroundColor: "#444375", color: "#fff" } }}
    >
      <Divider style={{ marginTop: 10 }}>
        <Typography.Text type="secondary">Создать чат</Typography.Text>
      </Divider>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Upload listType="picture-circle" showUploadList={false}>
          <PlusOutlined />
          Фото
        </Upload>
        <Input style={{ marginLeft: 25 }} addonBefore="Название чата" />
      </div>
      <Divider style={{ marginTop: 0 }}>
        <Typography.Text type="secondary">Пользователи</Typography.Text>
      </Divider>
      <div>
        <Input placeholder="Поиск" prefix={<SearchOutlined />} />
      </div>
      <div style={{ marginTop: 10, height: "200px", overflow: "auto" }}>
        {[1, 2, 3, 1, 2, 3].map(() => (
          <div
            className="create-chat-user-item"
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "5px 10px",
            }}
          >
            <div>
              <Avatar size="large" />
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <Typography.Text>Артем Гужов</Typography.Text>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Checkbox />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
