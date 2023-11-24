import React from "react";
import { Layout, theme } from "antd";

const Header: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Header
      style={{ padding: 0, background: colorBgContainer, height: 61 }}
    ></Layout.Header>
  );
};

export default Header;
