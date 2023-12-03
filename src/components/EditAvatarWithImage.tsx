import { Avatar } from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import $api from "../http";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store/store";
import Upload from "antd/es/upload/Upload";
import { UploadProps } from "antd/lib";
import { API_URL } from "../constants";

export const EditAvatarWithImage: FC<{
  fileId: string;
  size?: number | "large" | "small" | "default";
  alt: string;
  title: string;
  onClick?: () => void;
  onSetFileId: (fileId: string) => void;
}> = observer(({ size, alt, fileId, onClick, title, onSetFileId }) => {
  const store = useContext(StoreContext);
  const [image, setImage] = useState(null);
  const [id, setId] = useState(fileId);

  const uploadProps: UploadProps = {
    name: "file",
    action: `${API_URL}/api/v1/files/upload`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    onChange(info) {
      if (info.file.status === "done") {
        setId(info.file.response.data.id);
        onSetFileId(info.file.response.data.id);
      }
    },
  };

  useEffect(() => {
    const existFile = store.files.find((file) => file.id === id);

    if (!existFile) {
      $api
        .get(`/api/v1/files/${id}`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          const img = "data:;base64," + base64;
          setImage(img);
          store.setFile(id, img);
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {});
      return;
    }

    setImage(existFile.image);
  }, [id]);

  return (
    <Upload showUploadList={false} {...uploadProps}>
      <Avatar
        size={size ?? "default"}
        alt={alt}
        src={image ?? ""}
        crossOrigin="anonymous"
        onClick={onClick}
      >
        {title}
      </Avatar>
    </Upload>
  );
});
