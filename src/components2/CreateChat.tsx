import {
  FormOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Input,
  List,
  Modal,
  Upload,
} from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";

const CreateChat: FC = () => {
  const store = useContext(StoreContext);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newChat, setNewChat] = useState<{
    name: string | null;
    userIds: string[];
  }>({
    name: null,
    userIds: [],
  });
  const [emailOrName, setEmailOrName] = useState("");

  const setOrDelUsers = (userId: string) => {
    const isExistUserId = newChat.userIds.find((id) => userId === id);

    if (isExistUserId) {
      return setNewChat({
        ...newChat,
        userIds: newChat.userIds.filter((id) => id !== userId),
      });
    }

    return setNewChat({
      ...newChat,
      userIds: [...newChat.userIds, userId],
    });
  };

  const onCreateChat = () => {
    store.createDialog(newChat.userIds, newChat.name);
    setIsModalOpen(false);
    setNewChat({
      name: "",
      userIds: [],
    });
    setEmailOrName("");
  };

  useEffect(() => {
    store.searchUser(emailOrName);
  }, [emailOrName]);

  useEffect(() => {
    store.getTeam();
  }, []);

  return (
    <>
      <Button
        icon={<FormOutlined />}
        type={"text"}
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        title="Создать чат"
        open={isModalOpen}
        okText={"Создать"}
        cancelText={"Закрыть"}
        onOk={onCreateChat}
        onCancel={() => setIsModalOpen(false)}
      >
        <Divider style={{ margin: 0, marginBottom: 10, padding: 0 }} />
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 4, display: "flex", width: "100%" }}>
              <Upload>
                <Button icon={<UploadOutlined />}>Загрузить фото</Button>
              </Upload>
            </div>
            <div style={{ flex: 6 }}>
              <Input
                placeholder="Название чата"
                bordered={true}
                value={newChat.name}
                onChange={(e) =>
                  setNewChat({ ...newChat, name: e.target.value })
                }
              />
              <Divider style={{ padding: 0, margin: 0 }} />
            </div>
          </div>
          <div>
            <Input
              placeholder="Поиск"
              prefix={<SearchOutlined />}
              bordered={false}
              size="large"
              value={emailOrName}
              onChange={(e) => setEmailOrName(e.target.value)}
            />
          </div>
        </div>
        <div
          id="scrollableUserCreateChatList"
          style={{
            height: "40vh",
            overflow: "auto",
          }}
        >
          <List
            size="small"
            loading={store.user.isLoadingTeam}
            bordered={false}
            dataSource={store.user.team}
            renderItem={(user) => {
              const isChecked = !!newChat.userIds.find(
                (userId) => userId === user.id
              );

              return (
                <List.Item
                  className="select-user"
                  onClick={() => setOrDelUsers(user.id)}
                >
                  <div
                    key={`create-chat-users-list-${user.id}`}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {user.avatar === null ? (
                        <Avatar size="small">{user.name[0]}</Avatar>
                      ) : (
                        <Avatar size="small" />
                      )}
                    </div>
                    <div style={{ flex: 6 }}>{user.name}</div>
                    <div style={{ flex: 1 }}>
                      <Checkbox checked={isChecked} />
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default observer(CreateChat);
