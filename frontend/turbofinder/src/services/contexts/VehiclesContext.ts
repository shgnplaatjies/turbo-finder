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

  viewableModels: VehicleModel[];
  viewableYears: number[];

  selectedModel: VehicleModel | undefined;
  selectedYear: number | undefined;
  selectedUnit: DistanceUnit | undefined;
}

export interface VehiclesContextActions {
  updateSelectedModel: Dispatch<SetStateAction<VehicleModel | undefined>>;
  updateSelectedYear: Dispatch<SetStateAction<number | undefined>>;
  updateSelectedUnit: Dispatch<SetStateAction<DistanceUnit | undefined>>;
}

export interface VehiclesContextValue
  extends VehiclesContextState,
    VehiclesContextActions {}

export const VehiclesContext = createContext<VehiclesContextValue | undefined>(
  undefined
);
