import React, { FC, useContext, useEffect } from "react";
// import { DefaultMessage } from "./DefaultMessage";
// import { ReplyMessage } from "./ReplyMessage";
// import { MessageDateDivider } from "./MessageDateDivider";
// import { InviteMessage } from "./InviteMessage";
import { StoreContext } from "../store/store";
import { observer } from "mobx-react-lite";
import { Spin } from "antd";
import { ReplyMessage } from "./ReplyMessage";
import { DefaultMessage } from "./DefaultMessage";
import { Message } from "../store/store-additional";
import { MessageDateDivider } from "./MessageDateDivider";
import { getDividerTime } from "../helpers";

export const ChatMessageList: FC<{
  differenceHeight: number;
  height?: number;
  isMaxHeight?: boolean;
  onOpenComments?: (msgId: string) => void;
  onSetRepliedMsg: (msgId: string) => void;
  messages: Message[];
}> = observer(
  ({
    differenceHeight,
    onSetRepliedMsg,
    height,
    isMaxHeight,
    onOpenComments,
    messages,
  }) => {
    const store = useContext(StoreContext);

    const onResent = (msgId: string) => {
      store.resentMessage(msgId);
    };

    useEffect(() => {
      store.getChatMessages();
    }, [store.selectedChat]);

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
        {store.isChatListLoading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          messages.map((message, index, msgList) => {
            const date = new Date(message.createdAt).getDate();
            const nextMsg = msgList[index + 1];
            const nextDate = nextMsg
              ? new Date(nextMsg.createdAt).getDate()
              : null;

            if (message.repliedToId !== null) {
              return (
                <>
                  <ReplyMessage
                    key={message.id}
                    isOnlyMsg={nextMsg?.simpleUser?.id === store.profile.id}
                    onReply={onSetRepliedMsg}
                    onOpenComments={onOpenComments}
                    message={message}
                    resentMessage={onResent}
                  />
                  {((nextDate && nextDate !== date) ||
                    index + 1 === msgList.length) && (
                    <MessageDateDivider
                      text={getDividerTime(message.createdAt)}
                    />
                  )}
                </>
              );
            }

            return (
              <>
                <DefaultMessage
                  key={message.id}
                  isOnlyMsg={nextMsg?.simpleUser?.id === store.profile.id}
                  onReply={onSetRepliedMsg}
                  onOpenComments={onOpenComments}
                  message={message}
                  resentMessage={onResent}
                />
                {((nextDate && nextDate !== date) ||
                  index + 1 === msgList.length) && (
                  <MessageDateDivider
                    text={getDividerTime(message.createdAt)}
                  />
                )}
              </>
            );
          })
        )}
      </div>
    );
  }
);
