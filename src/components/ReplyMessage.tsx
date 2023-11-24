import {
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  EnterOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Tooltip, Typography } from "antd";
import Link from "antd/es/typography/Link";
import React, { FC, useEffect, useState } from "react";

export const ReplyMessage: FC<{
  isOnlyMsg?: boolean;
  onReply: () => void;
  onOpenComments: () => void;
}> = ({ isOnlyMsg, onReply, onOpenComments }) => {
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
                16:10
              </Typography.Text>
            )}
          </div>
        ) : (
          <Avatar size="large" />
        )}
      </div>
      <div
        style={{
          width: "100vw - 380px",
        }}
      >
        {!isOnlyMsg && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong>Артем Гужов</Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11, marginLeft: 10 }}
            >
              16.12
            </Typography.Text>
          </div>
        )}
        <div
          style={{
            display: "flex",
            marginTop: 10,
            border: "1px solid #a7adb4",
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderBottom: 0,
          }}
        >
          <div
            style={{
              width: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar size="large" />
          </div>
          <div style={{ width: "100vw - 380px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography.Text strong>Артем Гужов</Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: 11, marginLeft: 10 }}
              >
                16:12
              </Typography.Text>
            </div>
            <Typography.Paragraph>{`Hello`}</Typography.Paragraph>
          </div>
        </div>
        <Typography.Paragraph>{`hello`}</Typography.Paragraph>
      </div>
      <div style={{ position: "absolute", right: 10, top: "-10px" }}>
        {isFocus && (
          <Button.Group>
            <Tooltip placement="topRight" title={"Ответить"}>
              <Button icon={<EnterOutlined />} onClick={onReply} />
            </Tooltip>
            <Tooltip placement="topRight" title={"Комментировать"}>
              <Button icon={<CommentOutlined />} onClick={onOpenComments} />
            </Tooltip>
            <Tooltip
              placement="topRight"
              title={isCopy ? "Скопировано" : "Копировать"}
            >
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText("message");
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
        )}
      </div>
      {onOpenComments && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 80,
            userSelect: "none",
          }}
          onClick={onOpenComments}
        >
          <Link>8 комментариев</Link>
        </div>
      )}
    </div>
  );
};
