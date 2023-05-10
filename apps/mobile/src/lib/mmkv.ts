import { MMKV } from "react-native-mmkv";
import { createJSONStorage } from "zustand/middleware";

export const mmkv = new MMKV();

export const zustandStorage = createJSONStorage(() => ({
  getItem: (key: string) => {
    return mmkv.getString(key);
  },
  setItem: (key: string, value: string) => {
    mmkv.set(key, value);
  },
  removeItem: (key: string) => {
    mmkv.delete(key);
  },
}));
