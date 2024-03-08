import { Dispatch, SetStateAction, createContext } from "react";

export interface VehicleModel {
  id: number;
  name: string;
  uuid: string;
  year: string;
  make: number;
}

export interface DistanceUnit {
  id: number;
  name: string;
  symbol: string;
  in_metric: string;
}

export interface VehiclesContextState {
  models: VehicleModel[];
  years: number[];
  units: DistanceUnit[];
  selectedModel: string;
  selectedYear: string;
  selectedUnit: string;
}

export interface VehiclesContextActions {
  updateSelectedModel: Dispatch<SetStateAction<string>>;
  updateSelectedYear: Dispatch<SetStateAction<string>>;
  updateSelectedUnit: Dispatch<SetStateAction<string>>;
}

export interface VehiclesContextValue
  extends VehiclesContextState,
    VehiclesContextActions {}

export const VehiclesContext = createContext<VehiclesContextValue | undefined>(
  undefined
);
