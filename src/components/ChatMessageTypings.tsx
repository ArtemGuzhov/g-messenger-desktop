import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { FC, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store/store";

export const ChatMessageTypings: FC<{
  setTotalHeight?: (value: number) => void;
}> = observer(({ setTotalHeight }) => {
  const store = useContext(StoreContext);
  const [height, setHeight] = useState(20);
  const [message, setMessage] = useState({
    text: "",
    fileIds: [],
  });

  //   const onKeyDown = (key: string) => {};

  useEffect(() => {
    const rows = message.text.split(/\r|\r\n|\n/).length;

    if (rows === 1 && height !== 20) {
      setTotalHeight && setTotalHeight(121 + 20);
      return setHeight(20);
    }

    if (rows !== 1 && rows < 6) {
      setTotalHeight && setTotalHeight(121 + rows * 20);
      setHeight(rows * 20);
    }
  }, [message]);

  return (
    <div
      style={{
        height: `${height + 40}px`,
        width: "calc(100vw-300px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Button
        icon={<UploadOutlined />}
        size="large"
        style={{ marginLeft: 20 }}
        type="dashed"
      />
      <div style={{ padding: "0 20px", width: "100%" }}>
        <TextArea
          style={{ resize: "none", height }}
          // onKeyDown={(e) => onKeyDown(e.key)}
          onChange={(e) => setMessage({ ...message, text: e.target.value })}
          value={message.text}
        />
      </div>
      <Button
        icon={<SendOutlined />}
        size="large"
        type="primary"
        style={{ marginRight: 20 }}
        disabled={!message.text && !message.fileIds.length}
        onClick={() => {
          store.createMessage(message);
          setMessage({
            text: "",
            fileIds: [],
          });
        }}
      />
    </div>
  );
});
