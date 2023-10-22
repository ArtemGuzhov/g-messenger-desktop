import { Dispatch } from "redux";
import { request } from "../../helpers";
import { GraphqType } from "../../helpers/request";
import { AuthActionType, IAuthAction } from "../reducers/auth-reducer";

export const signIn = (payload: { email: string; password: string }) => {
  return async (dispatch: Dispatch<IAuthAction>) => {
    try {
      const { email, password } = payload;

      dispatch({
        type: AuthActionType.SET_LOADING,
        payload: { loading: true },
      });

      const data = await request<{
        auth: {
          signIn: {
            accessToken: string;
            refreshToken: string;
          };
        };
      }>(
        `
          auth {
            signIn(input:{email:"${email}", password: "${password}"}){
              accessToken
              refreshToken
            }
          }`,
        GraphqType.QUERY
      );

      const {
        auth: {
          signIn: { accessToken, refreshToken },
        },
      } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch({
        type: AuthActionType.SET_AUTH,
        payload: {
          isAuth: true,
        },
      });

      dispatch({
        type: AuthActionType.SET_LOADING,
        payload: { loading: false },
      });
    } catch (error) {
      dispatch({
        type: AuthActionType.SET_ERROR,
        payload: {
          error,
        },
      });
    }
  };
};
