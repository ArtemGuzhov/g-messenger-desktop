import React, { createContext, useContext, useEffect, useMemo } from "react";
import { StoreContext } from "./store/store";
import { observer } from "mobx-react-lite";
import { ChatPage } from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import { message, notification } from "antd";
import { MainLoader } from "./components/MainLoader";

const Context = createContext({ name: "notification" });

const App = () => {
  const store = useContext(StoreContext);

  const [$notification, notificationContext] = notification.useNotification();
  const [$error, errorContext] = message.useMessage();

  const contextValue = useMemo(() => ({ name: "item" }), []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {store.isInitLoading ? (
        <MainLoader />
      ) : store.isAuth ? (
        <Context.Provider value={contextValue}>
          <ChatPage
            $notification={$notification}
            notificationContext={notificationContext}
            $error={$error}
            errorContext={errorContext}
          />
        </Context.Provider>
      ) : (
        <AuthPage />
      )}
    </div>
  );
};

export default observer(App);
