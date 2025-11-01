import { createContext } from "react";

interface ActiveAssetContextType {
  selectedType: string | null;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
  selectedAssetIndex: number | null;
  setSelectedAssetIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

// Create context with proper initialization
export const ActiveAssetContext = createContext<
  ActiveAssetContextType | undefined
>(undefined);
