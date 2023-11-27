import { Avatar, Button, Divider, Input, Modal, Typography } from "antd";
import React, { FC, useContext } from "react";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";

export const ProfileModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}> = observer(({ isOpen, onClose, onUpdate }) => {
  const store = useContext(StoreContext);

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar size={80} />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography.Text style={{ fontSize: 20 }}>{store.profile?.name}</Typography.Text>
      </div>
      <Divider>
        <Typography.Text type="secondary">Данные</Typography.Text>
      </Divider>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Input addonBefore="Имя" />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Input addonBefore="Новый пароль" />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Input addonBefore="Новый пароль 2" />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Button
            onClick={() => {
              onClose();
              store.logout();
            }}
            danger
          >
            Выйти
          </Button>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{ backgroundColor: "#444375", color: "#fff" }}
            onClick={onUpdate}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  );
});
