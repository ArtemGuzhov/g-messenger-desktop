import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Checkbox,
  Divider,
  Input,
  Modal,
  Spin,
  Typography,
  Upload,
} from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";
import { CreateChatPayload } from "../store/store-additional";

export const CreateChatModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateChatPayload) => void;
}> = observer(({ isOpen, onClose, onCreate }) => {
  const store = useContext(StoreContext);
  const [chat, setChat] = useState({
    name: "",
    userIds: [],
  });
  const [search, setSeach] = useState("");

  const onAddOrDelUser = (userId: string) => {
    const isExistUserId = chat.userIds.find((id) => id === userId);

    if (isExistUserId) {
      setChat({ ...chat, userIds: chat.userIds.filter((id) => id !== userId) });
      return;
    }

    setChat({ ...chat, userIds: [...chat.userIds, userId] });
  };

  useEffect(() => {
    if (!search) {
      store.getUserTeam();
      return;
    }

    store.searchInTeam(search);
  }, [search]);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={() => {
        onCreate(chat);
        setChat({
          name: "",
          userIds: [],
        });
      }}
      okText="Создать"
      cancelText="Отмена"
      okButtonProps={{
        disabled:
          (chat.name && chat.userIds.length < 2) ||
          (!chat.name &&
            (chat.userIds.length === 0 || chat.userIds.length > 1)),
        loading: store.isCreateChatLoading,
      }}
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
        <Input
          style={{ marginLeft: 25 }}
          addonBefore="Название чата"
          value={chat.name}
          onChange={(e) => setChat({ ...chat, name: e.target.value })}
        />
      </div>
      <Divider style={{ marginTop: 0 }}>
        <Typography.Text type="secondary">Пользователи</Typography.Text>
      </Divider>
      <div>
        <Input
          placeholder="Поиск"
          prefix={<SearchOutlined />}
          onChange={(e) => setSeach(e.target.value)}
          value={search}
        />
      </div>
      <div style={{ marginTop: 10, height: "200px", overflow: "auto" }}>
        {store.isUserListLoading ? (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin />
          </div>
        ) : (
          store.userList.map((user) => (
            <div
              className="create-chat-user-item"
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "5px 10px",
              }}
              onClick={() => onAddOrDelUser(user.id)}
            >
              <div>
                <Avatar size="large" />
              </div>
              <div style={{ flex: 1, marginLeft: 10 }}>
                <Typography.Text>{user.name}</Typography.Text>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Checkbox
                  onClick={() => onAddOrDelUser(user.id)}
                  checked={!!chat.userIds.find((id) => user.id == id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
});
