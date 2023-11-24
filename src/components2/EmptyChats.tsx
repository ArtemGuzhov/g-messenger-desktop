import { MessageFilled } from "@ant-design/icons";
import { Result } from "antd";
import React, { useContext } from "react";
import { StoreContext } from "../store/store";
import Loader from "./Loader";

const EmptyChats = () => {
  const store = useContext(StoreContext);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {store.chat.isLoadingList ? (
        <Loader />
      ) : (
        <Result icon={<MessageFilled />} title="У вас пока нет чатов" />
      )}
    </div>
  );
};

export default EmptyChats;
