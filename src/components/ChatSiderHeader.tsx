import { NotificationTwoTone } from "@ant-design/icons";
import { Avatar, Button, Popover, Typography } from "antd";
import React, { FC, useState } from "react";
import { NotificationPopover } from "./NotificationPopover";
import { ProfileModal } from "./ProfileModal";

export const ChatSiderHeader: FC = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const onSetTime = (time: number) => {
    setIsNotificationOpen(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        display: "flex",
        backgroundColor: "#35345c",
      }}
    >
      <div
        className="profile-avatar"
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar size="large" onClick={() => setIsProfileModalOpen(true)} />
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdate={() => setIsProfileModalOpen(false)}
        />
      </div>
      <div
        style={{
          display: "flex",
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography.Text style={{ color: "#fff" }}>Qtim</Typography.Text>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Popover
          content={<NotificationPopover onSetTime={onSetTime} />}
          trigger="click"
          color="#35345c"
          open={isNotificationOpen}
          onOpenChange={(isOpen) => setIsNotificationOpen(isOpen)}
        >
          <Button
            icon={<NotificationTwoTone twoToneColor="#fff" />}
            size="large"
            type="text"
            onClick={() => setIsNotificationOpen(true)}
          />
        </Popover>
      </div>
    </div>
  );
};
