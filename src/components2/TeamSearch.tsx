import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, { useState } from "react";

const TeamSearch = () => {
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div style={{ flex: 6 }}>
        <Input
          size="large"
          placeholder="Поиск"
          prefix={<SearchOutlined />}
          bordered={false}
          onFocus={() => setIsSearch(true)}
          onBlur={() => setIsSearch(false)}
        />
      </div>
    </div>
  );
};

export default TeamSearch;
