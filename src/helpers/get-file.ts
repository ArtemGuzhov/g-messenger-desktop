import axios from "axios";
import { API_URL } from "../constants";

export const getFile = async (fileId: string) => {
  const { data: response } = await axios.get(
    `${API_URL}/api/v1/files/${fileId}`,
    {
      headers: {
        Authorization: `Bearer ${await localStorage.getItem("accessToken")}`,
      },
    }
  );

  return `https://g-messenger.hb.bizmrg.com/${fileId}`;
};
