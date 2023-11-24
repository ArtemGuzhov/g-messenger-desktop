import React, { FC, useContext } from "react";
import { DefaultMessage } from "./DefaultMessage";
import { ReplyMessage } from "./ReplyMessage";
import { MessageDateDivider } from "./MessageDateDivider";
import { InviteMessage } from "./InviteMessage";
import { StoreContext } from "../store/store";

export const ChatMessageList: FC<{
  differenceHeight: number;
  height?: number;
  isMaxHeight?: boolean;
  onOpenComments?: () => void;
  onSetRepliedMsg: () => void;
}> = ({
  differenceHeight,
  onSetRepliedMsg,
  height,
  isMaxHeight,
  onOpenComments,
}) => {
  const store = useContext(StoreContext);

  return (
    <div
      style={{
        width: "calc(100vw-300px)",
        [isMaxHeight ? "maxHeight" : "height"]: `calc(${
          height ?? 100
        }vh - ${differenceHeight}px)`,
        flexDirection: "column-reverse",
        overflow: "auto",
        display: "flex",
        paddingTop: "20px",
      }}
    >
      {store.messageList.map((message) => (
        <></>
      ))}
      {/* <InviteMessage />
      <DefaultMessage
        isOnlyMsg={true}
        onReply={onSetRepliedMsg}
        onOpenComments={onOpenComments}
      />
      <ReplyMessage
        isOnlyMsg={true}
        onReply={onSetRepliedMsg}
        onOpenComments={onOpenComments}
      />
      <DefaultMessage
        onReply={onSetRepliedMsg}
        onOpenComments={onOpenComments}
      />
      <MessageDateDivider />
      <ReplyMessage onReply={onSetRepliedMsg} onOpenComments={onOpenComments} /> */}
    </div>
  );
};
