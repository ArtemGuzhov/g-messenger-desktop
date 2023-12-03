import { Avatar, Button, Divider, Input, Modal, Typography } from "antd";
import React, { FC, useContext, useState } from "react";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";
import { AvatarWithImage } from "./AvatarWithImage";
import { EditAvatarWithImage } from "./EditAvatarWithImage";

export const ProfileModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}> = observer(({ isOpen, onClose, onUpdate }) => {
  const store = useContext(StoreContext);

  const [profile, setProfile] = useState({
    name: store.profile?.name,
    label: store.profile?.label,
    fileId: store.profile?.avatar?.id,
  });

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null}>
      {/* <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!store.profile?.avatar ? (
          <Avatar size={80} alt="profile-avatar-modal">
            {store.profile?.name ? store.profile.name[0] : ""}
          </Avatar>
        ) : (
          <EditAvatarWithImage
            fileId={store.profile.avatar.id}
            size={80}
            alt="profile-avatar-modal"
            title={store.profile.name[0]}
            onSetFileId={(fileId) => setProfile({ ...profile, fileId })}
          />
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography.Text style={{ fontSize: 20 }}>
          {store.profile?.name}
        </Typography.Text>
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
        <Input
          addonBefore="Имя"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
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
        <Input
          addonBefore="Тег"
          value={profile.label}
          onChange={(e) => setProfile({ ...profile, label: e.target.value })}
        />
      </div> */}
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
        {/* <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{ backgroundColor: "#444375", color: "#fff" }}
            onClick={onUpdate}
          >
            Сохранить
          </Button>
        </div> */}
      </div>
    </Modal>
  );
});
