import React, { useEffect } from "react";
import Auth from "./auth/Auth";
import { useTypedSelector } from "..//hooks/use-typed-selector";
import Main from "./main/Main";

function App() {
  const isAuth = !useTypedSelector((state) => state.auth.isAuth);

  useEffect(() => {
    console.log("isAuth", isAuth);
  }, [isAuth]);

  return !isAuth ? <Auth /> : <Main />;
}

export default App;
