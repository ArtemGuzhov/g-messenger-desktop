import { Divider, Typography } from "antd";
import React, { FC } from "react";

export const MessageDateDivider: FC<{ text: string }> = ({ text }) => {
  return (
    <Divider>
      <Typography.Text type="secondary">{text}</Typography.Text>
    </Divider>
  );
};
