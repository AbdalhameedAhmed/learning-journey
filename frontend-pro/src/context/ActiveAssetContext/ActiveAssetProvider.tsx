import { useState, type ReactNode } from "react";
import { ActiveAssetContext } from "./ActiveAssetContext";

interface ActiveAssetContextProviderProps {
  children: ReactNode;
}

export const ActiveAssetContextProvider: React.FC<
  ActiveAssetContextProviderProps
> = ({ children }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number | null>(
    null,
  );

  const value = {
    selectedType,
    setSelectedType,
    selectedAssetIndex,
    setSelectedAssetIndex,
  };

  return (
    <ActiveAssetContext.Provider value={value}>
      {children}
    </ActiveAssetContext.Provider>
  );
};
