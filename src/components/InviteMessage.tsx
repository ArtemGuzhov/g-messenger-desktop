import {
  ArrowRightOutlined,
  CheckCircleFilled,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Tooltip, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";

export const InviteMessage: FC<{
  isOnlyMsg?: boolean;
}> = ({ isOnlyMsg }) => {
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
      <div style={{ width: "100vw - 380px" }}>
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
            <Avatar size="large" />
          </div>
          <div style={{ width: "100vw - 380px", paddingLeft: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography.Text strong>Артем Гужов</Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: 11, marginLeft: 10 }}
              >
                16.12
              </Typography.Text>
            </div>
            <Typography.Text type="secondary">
              Приглашение в группу
            </Typography.Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Button.Group>
              <Tooltip title="Отклонить">
                <Button icon={<CloseOutlined />} danger type="primary" />
              </Tooltip>
              <Tooltip title="Принять">
                <Button
                  icon={<CheckOutlined />}
                  style={{ backgroundColor: "#52c41a" }}
                  type="dashed"
                />
              </Tooltip>
            </Button.Group>
            {/* <Tooltip title="Перейти">
              <Button
                icon={<ArrowRightOutlined />}
                style={{ backgroundColor: "#52c41a" }}
              />
            </Tooltip> */}
          </div>
        </div>
      </div>
    </div>
  );
};
