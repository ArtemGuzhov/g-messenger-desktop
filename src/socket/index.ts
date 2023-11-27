import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants";

const $socket = io(SOCKET_URL, {
  extraHeaders: {
    Authorization: localStorage.getItem("accessToken"),
  },
  autoConnect: false,
});

export default $socket;
