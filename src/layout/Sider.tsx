import React, { useContext } from "react";
import { Avatar, Divider, Layout } from "antd";
import Menu from "./Menu";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";

const Sider: React.FC = () => {
  const store = useContext(StoreContext);
  const profile = store.user.profile;

  return (
    <Layout.Sider
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 60,
          padding: "0 10px",
        }}
      >
        <div style={{ flex: 1 }}>
          <Avatar
            size={40}
            style={{
              borderColor: "#fff",
            }}
          >
            {profile.name[0]}
          </Avatar>
        </div>
        <div style={{ flex: 2 }}>
          <span style={{ color: "#fff" }}>{profile.name}</span>
        </div>
      </div>
      <Divider style={{ backgroundColor: "#f1f1f1", padding: 0, margin: 0 }} />
      <Menu />
    </Layout.Sider>
  );
};

export default observer(Sider);
