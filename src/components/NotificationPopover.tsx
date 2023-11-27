import { FieldTimeOutlined } from "@ant-design/icons";
import { Divider, Typography } from "antd";
import React, { FC } from "react";
import { observer } from "mobx-react-lite";

export const NotificationPopover: FC<{ onSetTime: (time: number) => void }> =
  observer(({ onSetTime }) => {
    const times = [
      { value: 60 * 30, text: "30 минут" },
      { value: 60 * 60, text: "1 час" },
      { value: 60 * 60 * 3, text: "3 часа" },
      { value: 60 * 60 * 6, text: "6 часов" },
      { value: 60 * 60 * 12, text: "12 часов" },
      { value: 60 * 60 * 24, text: "24 часа" },
    ];

    return (
      <div
        style={{
          width: "200px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Typography.Text style={{ color: "#fff", fontWeight: 0 }}>
            Отключить уведомления
          </Typography.Text>
        </div>
        <Divider>
          <Typography.Text style={{ color: "#fff", fontWeight: 0 }}>
            на
          </Typography.Text>
        </Divider>
        {times.map((time) => (
          <div
            style={{
              display: "flex",
              height: 30,
              alignItems: "center",
              padding: "0 5px",
              cursor: "pointer",
            }}
            className="notification-time-item"
            onClick={() => onSetTime(time.value)}
            key={time.value}
          >
            <div>
              <FieldTimeOutlined twoToneColor="#fff" />
            </div>
            <div style={{ marginLeft: 10 }}>
              <Typography.Text style={{ color: "#fff", fontWeight: 0 }}>
                {time.text}
              </Typography.Text>
            </div>
          </div>
        ))}
      </div>
    );
  });
