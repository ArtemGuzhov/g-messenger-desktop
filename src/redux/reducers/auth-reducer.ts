export interface IAuthState {
  loading: boolean;
  error: string | null;
  isAuth: boolean;
}

export enum AuthActionType {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_AUTH = "SET_AUTH",
}

export interface ISetLoading {
  type: AuthActionType;
  payload: {
    loading: boolean;
  };
}

export interface ISetError {
  type: AuthActionType;
  payload: {
    error: string;
  };
}

export interface ISetAuth {
  type: AuthActionType;
  payload: {
    isAuth: boolean;
  };
}

export type IAuthAction = ISetLoading | ISetError | ISetAuth;

const defaultState: IAuthState = {
  loading: false,
  error: null,
  isAuth: false,
};

export const authReducer = (
  state = defaultState,
  action: IAuthAction
): IAuthState => {
  switch (action.type) {
    case AuthActionType.SET_LOADING:
      return {
        ...state,
        loading: (action as unknown as ISetLoading).payload.loading,
        error: null,
      };
    case AuthActionType.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: (action as unknown as ISetError).payload.error,
      };
    case AuthActionType.SET_AUTH:
      return {
        ...state,
        isAuth: (action as unknown as ISetAuth).payload.isAuth,
      };
    default:
      return state;
  }
};
