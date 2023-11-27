import { Avatar } from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import $api from "../http";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store/store";

export const AvatarWithImage: FC<{
  fileId: string;
  size?: number | "large" | "small" | "default";
  alt: string;
  title: string;
  onClick?: () => void;
}> = observer(({ size, alt, fileId, onClick, title }) => {
  const store = useContext(StoreContext);
  const [image, setImage] = useState(null);
  useEffect(() => {
    const existFile = store.files.find((file) => file.id === fileId);

    if (!existFile) {
      $api
        .get(`/api/v1/files/${fileId}`, {
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
          store.setFile(fileId, img);
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {});
      return;
    }

    setImage(existFile.image);
  }, []);

  return (
    <Avatar
      size={size ?? "default"}
      alt={alt}
      src={image ?? ""}
      crossOrigin="anonymous"
      onClick={onClick}
    >
      {title}
    </Avatar>
  );
});
