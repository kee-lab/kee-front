import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isNull, omitBy } from "lodash";

import { UserLog, UserState } from "@/types/sse";
import { TwitterUserInfo } from "@/types/user";
import BASE_URL from "../config";

export interface State {
  ids: number[];
  byId: { [id: number]: TwitterUserInfo };
}
const initialState: State = {
  ids: [],
  byId: {}
};

const twitterUsersSlice = createSlice({
  name: "twitterUsers",
  initialState,
  reducers: {
    resetTwitterUsers() {
      return initialState;
    },
    fillTwitterUsers(state, action: PayloadAction<TwitterUserInfo[]>) {
      const twitterUsers = action.payload || [];
      state.ids = twitterUsers.map(({ uid }) => uid);
      state.byId = Object.fromEntries(
        twitterUsers.map((c) => {
          const { uid } = c;
          return [uid, c];
        })
      );
    },
    removeUser(state, action: PayloadAction<number>) {
      const uid = action.payload;
      state.ids = state.ids.filter((i) => i != uid);
      delete state.byId[uid];
    },
    updateUsers(state, action: PayloadAction<TwitterUserInfo[]>) {
      const twitterUsers = action.payload;
      twitterUsers.forEach((u) => {
        state.byId[u.uid] = u;
      });
    },
    addTwitterUser(state, action: PayloadAction<TwitterUserInfo>) {
      const twitterUser = action.payload || [];
      state.ids.push(twitterUser.uid);
      state.byId[twitterUser.uid] = twitterUser;
    }
  }
});

export const { addTwitterUser, resetTwitterUsers, fillTwitterUsers, removeUser, updateUsers } =
  twitterUsersSlice.actions;
export default twitterUsersSlice.reducer;
