import React, { FC } from "react";
import "../css/chat-loader.css";
import { observer } from "mobx-react-lite";

export const ChatLoader: FC = observer(() => {
  return <span className="chat-loader"></span>;
});
