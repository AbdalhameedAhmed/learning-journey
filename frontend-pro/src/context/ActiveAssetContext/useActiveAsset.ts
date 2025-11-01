import { useContext } from "react";
import { ActiveAssetContext } from "./ActiveAssetContext";

export const useActiveAssetContext = () => {
  const context = useContext(ActiveAssetContext);
  if (context === undefined) {
    throw new Error(
      "useActiveAssetContext must be used within an ActiveAssetContextProvider",
    );
  }
  return context;
};
