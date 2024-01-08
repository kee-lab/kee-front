import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GearApi } from "@gear-js/api";

export interface State {
  gearApi: GearApi | undefined;
}
const initialState: State = {
  gearApi: undefined
};

const walletInfoSlice = createSlice({
  name: "twitterUsers",
  initialState,
  reducers: {
    resetTwitterUsers() {
      return initialState;
    },
    fillGearApi(state, action: PayloadAction<GearApi>) {
      const gearApi = action.payload;
      state.gearApi = gearApi;
    }
  }
});

export const { resetTwitterUsers, fillGearApi } = walletInfoSlice.actions;
export default walletInfoSlice.reducer;
