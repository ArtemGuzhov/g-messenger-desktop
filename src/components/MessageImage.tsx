import { Image } from "antd";
import React, { FC, useContext, useEffect, useState } from "react";
import $api from "../http";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store/store";

export const MessageImage: FC<{
  fileId: string;
  width: string | number;
  height: string | number;
}> = observer(({ fileId, width, height }) => {
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
  }, [fileId]);

  return <Image width={width} src={image} height={height} />;
});
