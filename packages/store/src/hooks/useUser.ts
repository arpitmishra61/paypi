import { useAtomValue } from "jotai";
import { userAtom } from "../atoms/userAtom";

export const useUser = () => {
  const value = useAtomValue(userAtom);
  return value;
};
