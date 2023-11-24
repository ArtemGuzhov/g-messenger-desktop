import React from "react";
import "../css/main-loader.css";

export const MainLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#444375",
      }}
    >
      <span className="loader"></span>
    </div>
  );
};
