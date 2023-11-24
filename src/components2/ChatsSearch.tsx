import { CloseOutlined, SearchOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useContext, useEffect, useState } from "react";
import CreateChat from "./CreateChat";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";

const ChatsSearch = () => {
  const store = useContext(StoreContext);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (isSearch) {
      store.searchChats(name);
      return;
    }

    store.getChats();
    setName("");
  }, [name, isSearch]);

  return (
    <div style={{ display: "flex", alignContent: "center" }}>
      <div style={{ flex: 6 }}>
        <Input
          size="large"
          placeholder="Поиск"
          prefix={<SearchOutlined />}
          bordered={false}
          onFocus={() => setIsSearch(true)}
          onBlur={() => setIsSearch(false)}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {isSearch ? (
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            icon={<CloseOutlined />}
            type={"text"}
            onClick={() => setIsSearch(false)}
          />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CreateChat />
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Button icon={<StarOutlined />} type={"text"} /> */}
          </div>
        </>
      )}
    </div>
  );
};

export default observer(ChatsSearch);
