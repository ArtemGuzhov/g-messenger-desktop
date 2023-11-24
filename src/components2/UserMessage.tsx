import { Avatar, Button, Popconfirm, Tooltip, Typography } from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import { getMessageTime } from "../helpers";
import {
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  EnterOutlined,
} from "@ant-design/icons";
import { StoreContext } from "../store/store";
import { Message } from "../store/store-additional";
import { observer } from "mobx-react-lite";
import ReplyMessage from "./ReplyMessage";

const UserMessage: FC<
  Message & {
    nextUserId?: string;
    onOpenReplyModal?: (messageId: string) => void;
    isNotInChat?: boolean;
  }
> = ({
  id,
  user: { name },
  createdAt: date,
  text,
  userId,
  nextUserId,
  onOpenReplyModal,
  isNotInChat,
  reply,
}) => {
  const store = useContext(StoreContext);
  const [isFocus, setIsFocus] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  useEffect(() => {
    if (isCopy) {
      setTimeout(() => setIsCopy(false), 2_000);
    }
  }, [isCopy]);

  return (
    <div
      style={{
        display: "flex",
        padding: "0 0 5px 0",
        cursor: isNotInChat ? "default" : "pointer",
        background: isFocus ? "#f1f1f1" : "#fff",
        position: "relative",
      }}
      onMouseMove={() => !isNotInChat && setIsFocus(true)}
      onMouseLeave={() => !isNotInChat && setIsFocus(false)}
    >
      <div style={{ width: 60, display: "flex", justifyContent: "flex-end" }}>
        {isFocus && userId === nextUserId && (
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            {getMessageTime(date)}
          </Typography.Text>
        )}
        {userId !== nextUserId && <Avatar size="large">{name[0]}</Avatar>}
      </div>
      <div style={{ width: "100%", padding: "0 10px" }}>
        {userId === nextUserId ? (
          <>
            <div>
              {reply !== null && reply && <ReplyMessage reply={reply} />}
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ alignItems: "start" }}>
                <Typography.Text>{text}</Typography.Text>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
              }}
            >
              <div>
                <Typography.Text strong>{name}</Typography.Text>
              </div>
              <div
                style={{
                  marginLeft: 10,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  {getMessageTime(date)}
                </Typography.Text>
              </div>
            </div>
            <div>{reply !== null && reply ? "1" : "2"}</div>
            <div>
              <Typography.Text>{text}</Typography.Text>
            </div>
          </>
        )}
      </div>
      <div style={{ position: "absolute", right: 10, top: "-10px" }}>
        {isFocus && !isNotInChat && (
          <Button.Group>
            <Tooltip placement="topRight" title={"Ответить"}>
              <Button
                size="small"
                icon={<EnterOutlined />}
                loading={store.message.isLoadingAction}
                onClick={() => onOpenReplyModal(id)}
              />
            </Tooltip>
            <Tooltip placement="topRight" title={"Комментировать"}>
              <Button
                size="small"
                icon={<CommentOutlined />}
                loading={store.message.isLoadingAction}
              />
            </Tooltip>

            <Tooltip
              placement="topRight"
              title={isCopy ? "Скопировано" : "Копировать"}
            >
              <Button
                size="small"
                icon={<CopyOutlined />}
                loading={store.message.isLoadingAction}
                onClick={() => {
                  navigator.clipboard.writeText(text);
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
                onConfirm={() => store.removeMessage(id)}
              >
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  loading={store.message.isLoadingAction}
                  danger
                />
              </Popconfirm>
            </Tooltip>
          </Button.Group>
        )}
      </div>
    </div>
  );
};

export default observer(UserMessage);
