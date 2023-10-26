import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AuthData, RenewTokenResponse } from "@/types/auth";
import {
  KEY_EXPIRE,
  KEY_LOGIN_USER,
  KEY_PWA_INSTALLED,
  KEY_REFRESH_TOKEN,
  KEY_TOKEN,
  KEY_UID
} from "../config";
import { StoredUser } from "./users";

interface State {
  initialized: boolean;
  authTwitter: boolean;
  guest: boolean;
  user: StoredUser | undefined;
  token: string;
  expireTime: number;
  refreshToken: string;
  roleChanged: boolean;
  voice: boolean;
  twitterUid: string | undefined;
}
const loginUser = localStorage.getItem(KEY_LOGIN_USER) || "";
const initialState: State = {
  initialized: true,
  authTwitter: false,
  guest: loginUser ? JSON.parse(loginUser).create_by == "guest" : false,
  user: loginUser ? JSON.parse(loginUser) : undefined,
  token: localStorage.getItem(KEY_TOKEN) || "",
  expireTime: Number(localStorage.getItem(KEY_EXPIRE) || +new Date()),
  refreshToken: localStorage.getItem(KEY_REFRESH_TOKEN) || "",
  roleChanged: false,
  voice: false,
  twitterUid: undefined
};

const emptyState: State = {
  initialized: true,
  authTwitter: false,
  guest: false,
  user: undefined,
  token: "",
  expireTime: +new Date(),
  refreshToken: "",
  roleChanged: false,
  voice: false,
  twitterUid: undefined
};

const authDataSlice = createSlice({
  name: "authData",
  initialState,
  reducers: {
    setAuthData(state, { payload }: PayloadAction<AuthData>) {
      const { initialized = true, user, token, refresh_token, expired_in = 0 } = payload;
      const { uid, create_by } = user;
      state.initialized = initialized;
      state.user = { ...state.user, ...user, status: "added" };
      state.guest = create_by == "guest";
      state.token = token;
      state.refreshToken = refresh_token;
      // 当前时间往后推expire时长
      const expireTime = +new Date() + Number(expired_in) * 1000;
      state.expireTime = expireTime;
      // set local data
      localStorage.setItem(KEY_LOGIN_USER, JSON.stringify(user));
      localStorage.setItem(KEY_EXPIRE, `${expireTime}`);
      localStorage.setItem(KEY_TOKEN, token);
      localStorage.setItem(KEY_REFRESH_TOKEN, refresh_token);
      localStorage.setItem(KEY_UID, `${uid}`);
    },
    updateLoginUser(state, { payload }: PayloadAction<Partial<StoredUser>>) {
      if (!state.user) return;
      const obj = { ...state.user, ...payload };
      Object.keys(obj).forEach((key) => {
        // @ts-ignore
        if (obj[key] === undefined) {
          // @ts-ignore
          delete obj[key];
        }
      });
      state.user = obj;
      localStorage.setItem(KEY_LOGIN_USER, JSON.stringify(obj));
    },
    updateRoleChanged(state, action: PayloadAction<boolean>) {
      state.roleChanged = action.payload;
    },
    resetAuthData() {
      // remove local data
      localStorage.removeItem(KEY_EXPIRE);
      localStorage.removeItem(KEY_TOKEN);
      localStorage.removeItem(KEY_REFRESH_TOKEN);
      localStorage.removeItem(KEY_UID);
      localStorage.removeItem(KEY_PWA_INSTALLED);
      return emptyState;
    },
    updateInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
    updateAuthTwitter(state, action: PayloadAction<string>) {
      state.twitterUid = action.payload;
      if (action.payload !== "0") {
        state.authTwitter = true;
      } else {
        state.authTwitter = false;
      }
    },
    updateToken(state, action: PayloadAction<RenewTokenResponse>) {
      const { token, refresh_token, expired_in } = action.payload;
      state.token = token;
      const et = +new Date() + Number(expired_in) * 1000;
      state.expireTime = et;
      state.refreshToken = refresh_token;
      localStorage.setItem(KEY_EXPIRE, `${et}`);
      localStorage.setItem(KEY_TOKEN, token);
      localStorage.setItem(KEY_REFRESH_TOKEN, refresh_token);
    }
  }
  // extraReducers: (builder) => {
  //   builder.addCase(updateUsersByLogs, (state, action) => {
  //     const changeLogs = action.payload;
  //     const currUid = Number(localStorage.getItem(KEY_UID) ?? 0);
  //     changeLogs.forEach(({ action, uid, ...rest }) => {
  //       if (uid == currUid && action == "update") {
  //         const vals = omitBy(rest, isNull);
  //         // const logId = state.user?.log_id ?? Number.MAX_SAFE_INTEGER;
  //         Object.keys(vals).forEach((k) => {
  //           console.log("upppp 2 ", vals.is_admin, state.user?.is_admin);
  //           if (k == "is_admin" && vals.is_admin !== state.user?.is_admin) {
  //             // 用户角色有变化
  //             state.roleChanged = true;
  //           }
  //         });
  //       }
  //     });

  //   });
  // }
});

export const {
  updateInitialized,
  updateAuthTwitter,
  updateLoginUser,
  setAuthData,
  resetAuthData,
  updateToken,
  updateRoleChanged
} = authDataSlice.actions;
export default authDataSlice.reducer;
