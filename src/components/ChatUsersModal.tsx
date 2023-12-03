import {
  Avatar,
  Button,
  Divider,
  Mentions,
  Modal,
  // Popconfirm,
  Spin,
  Tag,
  // Tooltip,
  Typography,
} from "antd";
import React, { FC, useState } from "react";
import { User } from "../store/store-additional";
import { AvatarWithImage } from "./AvatarWithImage";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import ButtonGroup from "antd/es/button/button-group";
import { observer } from "mobx-react-lite";

export const ChatUsersModal: FC<{
  isOpen: boolean;
  users: User[];
  isLoading: boolean;
  inviteUsers: { id: string; value: string; label: string }[];
  isInviteLoading: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onInvite: (chatId: string) => void;
}> = observer(
  ({
    isLoading,
    users,
    inviteUsers,
    isOpen,
    isInviteLoading,
    isAdmin,
    onClose,
    onInvite,
  }) => {
    const [text, setText] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);

    return (
      <Modal open={isOpen} footer={null} title="Участники" onCancel={onClose}>
        {isAdmin && (
          <div style={{ display: "flex" }}>
            <Mentions
              style={{ width: "100%" }}
              placeholder="@"
              value={text}
              options={inviteUsers}
              disabled={isInviteLoading}
              onSelect={(item) => {
                setSelectedUserId((item as unknown as { id: string }).id);
              }}
              onChange={(val) => {
                if (!selectedUserId) {
                  setText(val);
                }
              }}
            />
            <ButtonGroup>
              <Button
                type="dashed"
                disabled={text.length < 2 || isInviteLoading}
                icon={<CloseOutlined />}
                onClick={() => {
                  setText("@");
                  setSelectedUserId(null);
                }}
              />
              <Button
                type="primary"
                disabled={!selectedUserId}
                onClick={() => {
                  setText("@");
                  setSelectedUserId(null);
                  onInvite(selectedUserId);
                }}
                loading={isInviteLoading}
              >
                Пригласить
              </Button>
            </ButtonGroup>
          </div>
        )}
        <div>
          <Divider style={{ marginTop: 5 }} />
          <div style={{ maxHeight: "50vh", overflow: "auto" }}>
            {isLoading ? (
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
              users.map((user) => (
                <div
                  className="create-chat-user-item"
                  key={user.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                  }}
                >
                  <div>
                    {user.avatar ? (
                      <AvatarWithImage
                        alt="user-item-avatar"
                        fileId={user.avatar.id}
                        title={user.name[0]}
                        size="large"
                      />
                    ) : (
                      <Avatar size="large">{user.name[0]}</Avatar>
                    )}
                  </div>
                  <div style={{ flex: 1, marginLeft: 10 }}>
                    <Typography.Text>{user.name}</Typography.Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {!!user.isExpect && (
                      <Tag color="green" icon={<LoadingOutlined />}>
                        Ждем ответа
                      </Tag>
                    )}
                    <Tag color="blue">{user.label}</Tag>
                  </div>

                  {/* {isAdmin && (
                    <div>
                      <Tooltip placement="topRight" title={"Исключить"}>
                        <Popconfirm
                          title="Исключить данного пользователя?"
                          okText="Да"
                          cancelText="Нет"
                          placement="bottom"
                        >
                          <Button
                            icon={<CloseOutlined />}
                            size="small"
                            danger
                            disabled={!!user.isExpect}
                          />
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  )} */}
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    );
  }
);
