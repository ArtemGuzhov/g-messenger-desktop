// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import team from "../imgs/team.svg";
// @ts-check
// import { MessageOutlined } from "@ant-design/icons";
// import { Typography } from "antd";
import React, { FC } from "react";

export const EmptyChatList: FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#f1f1f1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <img src={team} />
        {/* <br />
        <MessageOutlined style={{ marginRight: 10 }} />
        <Typography.Text italic>У вас пока нет чатов</Typography.Text> */}
      </div>
    </div>
  );
};
