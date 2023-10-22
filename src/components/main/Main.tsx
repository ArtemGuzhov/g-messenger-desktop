import React from "react";
import Content from "./content/Content";
import Sider from "./sider/Sider";

function Main() {
  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
      <Sider />
      <div style={{ backgroundColor: "#000", width: 2 }}></div>
      <Content />
    </div>
  );
}

export default Main;
