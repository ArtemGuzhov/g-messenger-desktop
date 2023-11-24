import React, { useEffect } from "react";
import { Layout, theme } from "antd";
import $socket from "../socket";

const Content: React.FC<{
  children: React.JSX.Element[] | React.JSX.Element;
}> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    $socket.connect();
  }, []);

  return (
    <Layout.Content style={{ margin: "24px 16px 0" }}>
      <div
        style={{
          height: "90vh",
          background: colorBgContainer,
        }}
      >
        {children}
      </div>
    </Layout.Content>
  );
};

export default Content;
