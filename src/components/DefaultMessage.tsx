import {
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  EnterOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Spin, Tooltip, Typography } from "antd";
import Link from "antd/es/typography/Link";
import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Message, MessageStatus } from "../store/store-additional";
import { getCommentsCountLabel, getMessageTime } from "../helpers";

export const DefaultMessage: FC<{
  isOnlyMsg?: boolean;
  onReply: (msgId: string) => void;
  onOpenComments: (msgId: string) => void;
  message: Message;
  resentMessage: (msgId: string) => void;
}> = observer(
  ({ isOnlyMsg, onReply, onOpenComments, message, resentMessage }) => {
    const [isFocus, setIsFocus] = useState(false);
    const [isCopy, setIsCopy] = useState(false);

    useEffect(() => {
      if (isCopy) {
        setTimeout(() => setIsCopy(false), 2_000);
      }
    }, [isCopy]);

    return (
      <Spin
        spinning={message.status === MessageStatus.PENDING}
        style={{
          display: "flex",
          width: "calc(100vw-300px)",
        }}
      >
        <div
          className="message-item"
          style={{
            display: "flex",
            padding: "10px 0",
            cursor: "pointer",
            position: "relative",
            backgroundColor:
              message.status === MessageStatus.ERROR ? "#fff2f0" : "#fff",
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
                style={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {isFocus && (
                  <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    {getMessageTime(message.createdAt)}
                  </Typography.Text>
                )}
              </div>
            ) : (
              <Avatar size="large" />
            )}
          </div>
          <div style={{ width: "100vw - 380px" }}>
            {!isOnlyMsg && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography.Text strong>
                  {message.simpleUser.name}
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 11, marginLeft: 10 }}
                >
                  {getMessageTime(message.createdAt)}
                </Typography.Text>
              </div>
            )}
            <Typography.Paragraph>{message.text ?? ""}</Typography.Paragraph>
          </div>
          <div style={{ position: "absolute", right: 10, top: "-10px" }}>
            {isFocus &&
              (message.status === MessageStatus.ERROR ||
              message.status === MessageStatus.PENDING ? (
                <Button.Group>
                  <Tooltip placement="topRight" title={"Переотправить"}>
                    <Button
                      icon={<RetweetOutlined />}
                      onClick={() => resentMessage(message.id)}
                    />
                  </Tooltip>
                </Button.Group>
              ) : (
                <Button.Group>
                  <Tooltip placement="topRight" title={"Ответить"}>
                    <Button
                      icon={<EnterOutlined />}
                      onClick={() => onReply(message.id)}
                    />
                  </Tooltip>
                  <Tooltip placement="topRight" title={"Комментировать"}>
                    <Button
                      icon={<CommentOutlined />}
                      onClick={() => onOpenComments(message.id)}
                    />
                  </Tooltip>
                  <Tooltip
                    placement="topRight"
                    title={isCopy ? "Скопировано" : "Копировать"}
                  >
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(message.text ?? "");
                        setIsCopy(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip placement="topRight" title={"Удалить"}>
                    <Popconfirm
                      title="Удалить данное сообщение?"
                      okText="Да"
                      cancelText="Нет"
                      placement="bottomLeft"
                    >
                      <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                  </Tooltip>
                </Button.Group>
              ))}
          </div>
          {onOpenComments && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 80,
                userSelect: "none",
              }}
              onClick={() => onOpenComments(message.id)}
            >
              <Link>{getCommentsCountLabel(message.commentsCount)}</Link>
            </div>
          )}
        </div>
      </Spin>
    );
  }
);
