import {
  ArrowRightOutlined,
  //   ArrowRightOutlined,
  //   CheckCircleFilled,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Spin, Tooltip, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Message, MessageInviteStatus } from "../store/store-additional";
import { getMessageTime } from "../helpers";
import { AvatarWithImage } from "./AvatarWithImage";

export const InviteMessage: FC<{
  isOnlyMsg?: boolean;
  message: Message;
  isMy: boolean;
  onAnswerOnInvite: (payload: {
    messageId: string;
    inviteStatus: MessageInviteStatus;
    inviteChatId: string;
  }) => void;
  onOpenChat: (chatId: string) => void;
}> = observer(({ isOnlyMsg, message, isMy, onAnswerOnInvite, onOpenChat }) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  useEffect(() => {
    if (isCopy) {
      setTimeout(() => setIsCopy(false), 2_000);
    }
  }, [isCopy]);

  return (
    <div
      className="message-item"
      style={{
        display: "flex",
        padding: "10px 0",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseMove={() => setIsFocus(true)}
      onMouseLeave={() => setIsFocus(false)}
    >
      <div
        style={{
          width: "60px",
          display: "flex",
          justifyContent: "center",
          paddingLeft: "20px",
        }}
      >
        {isOnlyMsg ? (
          <div
            style={{ width: "40px", display: "flex", justifyContent: "center" }}
          >
            {isFocus && (
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                {getMessageTime(message.createdAt)}
              </Typography.Text>
            )}
          </div>
        ) : message?.simpleUser?.avatar ? (
          <AvatarWithImage
            fileId={message.simpleUser.avatar.id}
            size="large"
            alt={`${message.simpleUser.avatar.id}`}
            title={message.simpleUser.name[0]}
          />
        ) : (
          <Avatar size="large">{message.simpleUser.name[0]}</Avatar>
        )}
      </div>
      <div style={{ width: "100vw - 380px" }}>
        {!isOnlyMsg && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong>{message.simpleUser.name}</Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11, marginLeft: 10 }}
            >
              {getMessageTime(message.createdAt)}
            </Typography.Text>
          </div>
        )}
        <div
          style={{
            marginTop: "5px",
            padding: "10px",
            border: "1px solid #a7adb4",
            borderRadius: 5,
            display: "flex",
          }}
        >
          <div
            style={{
              width: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {message?.inviteChat?.avatar ? (
              <AvatarWithImage
                fileId={message.inviteChat.avatar.id}
                size="large"
                alt={`${message.inviteChat.avatar.id}`}
                title={message.inviteChat.name[0]}
              />
            ) : (
              <Avatar size="large">{message.inviteChat.name[0]}</Avatar>
            )}
          </div>
          <div style={{ width: "100vw - 380px", paddingLeft: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography.Text strong>
                {message.inviteChat.name}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: 11, marginLeft: 10 }}
              >
                {getMessageTime(message.createdAt)}
              </Typography.Text>
            </div>
            <Typography.Text type="secondary">
              {message.inviteStatus === MessageInviteStatus.PENDING
                ? message.text
                : message.inviteStatus === MessageInviteStatus.ACCEPTED
                ? "Приглашение принято"
                : "Приглашение отклонено"}
            </Typography.Text>
          </div>
          {!isMy && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              {message.inviteStatus === MessageInviteStatus.PENDING && (
                <Button.Group>
                  <Tooltip title="Отклонить">
                    <Button
                      icon={<CloseOutlined />}
                      danger
                      type="primary"
                      onClick={() =>
                        onAnswerOnInvite({
                          messageId: message.id,
                          inviteChatId: message.inviteChatId,
                          inviteStatus: MessageInviteStatus.REJECTED,
                        })
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Принять">
                    <Button
                      icon={<CheckOutlined />}
                      type="primary"
                      onClick={() =>
                        onAnswerOnInvite({
                          messageId: message.id,
                          inviteChatId: message.inviteChatId,
                          inviteStatus: MessageInviteStatus.ACCEPTED,
                        })
                      }
                    />
                  </Tooltip>
                </Button.Group>
              )}
              {message.inviteStatus === MessageInviteStatus.ACCEPTED && (
                <Tooltip title="Перейти">
                  <Button
                    icon={<ArrowRightOutlined />}
                    type="primary"
                    onClick={() => onOpenChat(message.inviteChat.id)}
                  />
                </Tooltip>
              )}
            </div>
          )}
          {isMy && message.inviteStatus === MessageInviteStatus.PENDING && (
            <Spin indicator={<LoadingOutlined />} />
          )}
        </div>
      </div>
    </div>
  );
});
