import { useAtomValue } from "jotai";
import { balanceAtom } from "../atoms/balanceAtom";

export const useBalance = () => {
  const value = useAtomValue(balanceAtom);
  return value;
};
