import { WhoAmI_whoami } from "@/graphql/__generated__/WhoAmI";
import { GetState, SetState } from "zustand";
import { AppState } from "./useStore";

export interface UserSlice {
  user: WhoAmI_whoami | null,
  setUser: (user: UserSlice['user']) => void
  clearUser: () => void
}

const createUserSlice = (set: SetState<AppState>, get: GetState<AppState>) => ({
  user: null,
  setUser: (user: UserSlice['user']) => set({ user }),
  clearUser: () => {
    set({
      user: null
    })
  }
});

export default createUserSlice;