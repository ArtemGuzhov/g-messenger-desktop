import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Popover, Upload } from "antd";
import TextArea, { TextAreaRef } from "antd/es/input/TextArea";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store/store";
import { UploadProps } from "antd/lib";
import { API_URL } from "../constants";

export const ChatMessageTypings: FC<{
  setTotalHeight?: (value: number) => void;
}> = observer(({ setTotalHeight }) => {
  const store = useContext(StoreContext);
  const [height, setHeight] = useState(32);
  const [message, setMessage] = useState({
    text: "",
    fileIds: [],
  });
  const [isSkip, setIsSkip] = useState(false);
  const textareaRef = useRef<TextAreaRef>(null);

  const uploadProps: UploadProps = {
    name: "file",
    action: `${API_URL}/api/v1/files/upload`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    onChange(info) {
      if (info.file.status === "done") {
        setMessage({
          ...message,
          fileIds: [...message.fileIds, info.file.response.data.id],
        });
      } else if (info.file.status === "removed") {
        setMessage({
          ...message,
          fileIds: message.fileIds.filter(
            (id) => id !== info.file.response.data.id
          ),
        });
      }
    },
  };

  const onKeyDown = (key: string) => {
    if (key === "Shift") {
      setIsSkip(true);
      setTimeout(() => setIsSkip(false), 500);
    }

    if (
      key === "Enter" &&
      !isSkip &&
      (message.text || message.fileIds.length)
    ) {
      onCreate();
    }
  };
  const onCreate = () => {
    store.createMessage(message);
    setMessage({
      text: "",
      fileIds: [],
    });
    textareaRef.current.focus({ cursor: "start" });
  };

  useEffect(() => {
    const rows = message.text.split(/\r|\r\n|\n/).length;

    if (rows === 1 && height !== 20) {
      setTotalHeight && setTotalHeight(121 + 32);
      return setHeight(32);
    }

    if (rows !== 1 && rows < 6) {
      setTotalHeight && setTotalHeight(121 + rows * 32);
      setHeight(rows * 32);
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
      <Popover
        content={
          <Upload
            style={{
              marginLeft: 20,
              display: "flex",
              justifyContent: "flex-end",
            }}
            {...uploadProps}
            maxCount={5}
            multiple
          >
            <Button size="small">Загрузить</Button>
          </Upload>
        }
        title={null}
        trigger="click"
      >
        <Button
          icon={<UploadOutlined />}
          type="dashed"
          style={{
            marginLeft: 20,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            height,
            width: "5%",
          }}
        />
      </Popover>
      <div style={{ width: "100%" }}>
        <TextArea
          style={{ resize: "none", height, borderRadius: 0 }}
          onKeyDown={(e) => onKeyDown(e.key)}
          onChange={(e) => setMessage({ ...message, text: e.target.value })}
          value={message.text}
          ref={textareaRef}
        />
      </div>
      <Button
        icon={<SendOutlined />}
        type="primary"
        style={{
          marginRight: 20,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 0,
          height,
          width: "5%",
        }}
        disabled={!message.text && !message.fileIds.length}
        onClick={onCreate}
      />
    </div>
  );
});
