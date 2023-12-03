import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StoreContext, Store } from "./store/store";
import ruRu from "antd/locale/ru_RU";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ConfigProvider locale={ruRu}>
    <StoreContext.Provider value={new Store()}>
      <App />
    </StoreContext.Provider>
  </ConfigProvider>
);
