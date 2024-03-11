import { useContext } from "react";
import {
  VehiclesContext,
  VehiclesContextValue,
} from "../contexts/VehiclesContext";

export const useVehiclesContext = (): VehiclesContextValue => {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error(
      "useVehiclesContext must be used within a VehiclesProvider"
    );
  }
  return context;
};
