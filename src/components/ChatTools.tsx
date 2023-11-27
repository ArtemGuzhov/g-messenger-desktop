import {
  CloseOutlined,
  MessageTwoTone,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Typography } from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import { CreateChatModal } from "./CreateChatModal";
import { StoreContext } from "../store/store";
import { CreateChatPayload } from "../store/store-additional";
import { observer } from "mobx-react-lite";

export const ChatTools: FC<{
  isSearch: boolean;
  setIsSearch: (v: boolean) => void;
}> = observer(({ isSearch, setIsSearch }) => {
  const store = useContext(StoreContext);
  const [search, setSearch] = useState("");
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);

  const onCreate = (payload: CreateChatPayload) => {
    store.createChat(payload);
    setIsCreateChatModalOpen(false);
  };

  useEffect(() => {
    if (search) {
      store.searchInChat(search);
    }
  }, [search]);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          padding: "0px 10px 0 20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <MessageTwoTone twoToneColor="#A7ADB4" />
          <Typography.Text
            style={{ fontSize: 14, color: "#A7ADB4", marginLeft: 5 }}
          >
            ЧАТЫ
          </Typography.Text>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          {isSearch ? (
            <Button
              icon={<CloseOutlined style={{ color: "#A7ADB4" }} />}
              onClick={() => {
                setIsSearch(false);
                store.getUserChats();
              }}
              type="text"
            />
          ) : (
            <Button
              icon={<SearchOutlined style={{ color: "#A7ADB4" }} />}
              onClick={() => setIsSearch(true)}
              type="text"
            />
          )}
          <Button
            icon={<PlusOutlined style={{ color: "#A7ADB4" }} />}
            type="text"
            onClick={() => setIsCreateChatModalOpen(true)}
          />
          <CreateChatModal
            isOpen={isCreateChatModalOpen}
            onClose={() => setIsCreateChatModalOpen(false)}
            onCreate={onCreate}
          />
        </div>
      </div>
      {isSearch && (
        <div style={{ padding: "0px 10px 0 20px" }}>
          <Input
            style={{
              backgroundColor: "#444375",
              color: "#fff",
              borderColor: "#A7ADB4",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск"
          />
        </div>
      )}
    </div>
  );
});
