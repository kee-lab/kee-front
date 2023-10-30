import { TwitterUserInfo } from "@/types/user";

export interface State {
  users: TwitterUserInfo[];
}

const initialState: State = {
  users: []
};
