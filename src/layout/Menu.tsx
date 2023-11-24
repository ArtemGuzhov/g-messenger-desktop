import { TeamOutlined, WechatOutlined } from "@ant-design/icons";
import { Menu as AntdMenu } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: WechatOutlined,
      name: "Чаты",
      path: "/main_window",
    },
    {
      icon: TeamOutlined,
      name: "Моя команда",
      path: "/team",
    },
  ];

  return (
    <AntdMenu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={menuItems.map((item, index) => ({
        key: String(index + 1),
        icon: React.createElement(item.icon),
        label: item.name,
        onClick: () => navigate(item.path),
      }))}
    />
  );
};

export default Menu;
