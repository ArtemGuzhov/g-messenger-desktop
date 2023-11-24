import { Divider, Typography } from "antd";
import React, { FC } from "react";

export const MessageDateDivider: FC = () => {
  return (
    <Divider>
      <Typography.Text type="secondary">Сегодня</Typography.Text>
    </Divider>
  );
};
