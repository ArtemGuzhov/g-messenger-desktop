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
import {
  Message,
  MessageInviteStatus,
  MessageType,
} from "../store/store-additional";
import { MessageDateDivider } from "./MessageDateDivider";
import { getDividerTime } from "../helpers";
import { InviteMessage } from "./InviteMessage";

export const ChatMessageList: FC<{
  differenceHeight: number;
  height?: number;
  isMaxHeight?: boolean;
  messages: Message[];
  isLoading: boolean;
  isComments?: boolean;
  onOpenComments?: (msgId: string) => void;
  onSetRepliedMsg: (msgId: string) => void;
}> = observer(
  ({
    differenceHeight,
    height,
    isMaxHeight,
    messages,
    isLoading,
    isComments,
    onSetRepliedMsg,
    onOpenComments,
  }) => {
    const store = useContext(StoreContext);

    const onResent = (msgId: string) => {
      store.resentMessage(msgId);
    };

    const onRemove = (msgId: string) => {
      store.removeMessage(msgId);
    };

    const onAnswerOnInvite = (payload: {
      messageId: string;
      inviteStatus: MessageInviteStatus;
      inviteChatId: string;
    }) => {
      store.answerOnInvite(payload);
    };

    useEffect(() => {
      store.getChatMessages();
    }, [store.selectedChat.id]);

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
        {isLoading ? (
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
            const isMy = message.userId === store.profile?.id;
            const isDeleted = !!message.deletedAt;

            if (message.type === MessageType.INVITE) {
              return (
                <div key={`invite-message-item-${message.id}`}>
                  {((nextDate && nextDate !== date) ||
                    index + 1 === msgList.length) &&
                    !isComments && (
                      <MessageDateDivider
                        text={getDividerTime(message.createdAt)}
                      />
                    )}
                  <InviteMessage
                    key={message.id}
                    message={message}
                    isMy={isMy}
                    onAnswerOnInvite={onAnswerOnInvite}
                    onOpenChat={(chatId: string) => store.setChat(chatId)}
                  />
                </div>
              );
            }

            if (message.repliedToId !== null) {
              return (
                <div key={`reply-message-item-${message.id}`}>
                  {((nextDate && nextDate !== date) ||
                    index + 1 === msgList.length) &&
                    !isComments && (
                      <MessageDateDivider
                        text={getDividerTime(message.createdAt)}
                      />
                    )}
                  <ReplyMessage
                    message={message}
                    isMy={isMy}
                    isDeleted={isDeleted}
                    onReply={onSetRepliedMsg}
                    onOpenComments={onOpenComments}
                    resentMessage={onResent}
                    onRemove={onRemove}
                  />
                </div>
              );
            }

            return (
              <div key={`default-message-item-${message.id}`}>
                {((nextDate && nextDate !== date) ||
                  index + 1 === msgList.length) &&
                  !isComments && (
                    <MessageDateDivider
                      text={getDividerTime(message.createdAt)}
                    />
                  )}
                <DefaultMessage
                  message={message}
                  isMy={isMy}
                  isDeleted={isDeleted}
                  onReply={onSetRepliedMsg}
                  onOpenComments={onOpenComments}
                  resentMessage={onResent}
                  onRemove={onRemove}
                />
              </div>
            );
          })
        )}
      </div>
    );
  }
);
