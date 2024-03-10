import { ReactNode, createElement, useEffect, useState } from "react";
import { getTurboApi } from "../api";
import { VehiclesContext } from "../contexts/VehiclesContext";

import {
  DistanceUnit,
  VehicleModel,
  VehiclesContextActions,
  VehiclesContextValue,
} from "../contexts/VehiclesContext";
import { GLOBAL_URLS, TOYOTA_UUID } from "../global/urls";
import { handleErrors } from "../handleErrors";

interface VehiclesProviderProps {
  children: ReactNode;
}

export const VehiclesProvider: React.FC<VehiclesProviderProps> = ({
  children,
}) => {
  const offsetStep = 100;
  const [offset, setOffset] = useState<number>(0);

  const [models, setModels] = useState<VehicleModel[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [units, setUnits] = useState<DistanceUnit[]>([]);

  const [selectedModel, setSelectedModel] = useState<VehicleModel | undefined>(
    undefined
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [selectedUnit, setSelectedUnit] = useState<DistanceUnit | undefined>(
    undefined
  );

  const [viewableModels, setViewableModels] = useState<VehicleModel[]>(models);
  const [viewableYears, setViewableYears] = useState<number[]>(years);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const turboApi = getTurboApi();

        const vehicleModelsResponse = await turboApi.get(
          `/api/vehicle-make/${TOYOTA_UUID}/models/`,
          { data: { limit: offsetStep, offset: offset } }
        );

        const unitsResponse = await turboApi.get(
          GLOBAL_URLS.distanceUnitsGeneral
        );

        const modelsData: VehicleModel[] = vehicleModelsResponse.data;
        const unitsData: DistanceUnit[] = unitsResponse.data;

        const uniqueYears = [
          ...new Set(
            modelsData.map((model) => new Date(model.year).getFullYear())
          ),
        ];

        setModels(modelsData);
        setYears(uniqueYears);
        setUnits(unitsData);

        setViewableModels(modelsData);
        setViewableYears(uniqueYears);
      } catch (error) {
        handleErrors(error, "Something went wrong with VehicleContextProvider");
      }
    };

    fetchData();
  }, [offset]);

  const updateOffset: VehiclesContextActions["updateOffset"] = (multiple) => {
    if (!multiple) return setOffset(0);

    if (typeof multiple !== "number")
      throw new Error(
        "Update selected multiple only accepts numbers, not callback functions."
      );

    if (multiple <= 0) return setOffset(0);

    setOffset(multiple);
  };

  const updateSelectedModel: VehiclesContextActions["updateSelectedModel"] = (
    model
  ) => {
    if (!model) return setSelectedModel(undefined);

    setSelectedModel(model);
    filterViewableYears(model.name);
  };

  const updateSelectedYear: VehiclesContextActions["updateSelectedYear"] = (
    year
  ) => {
    if (!year) return setSelectedYear(undefined);

    if (typeof year !== "number")
      throw new Error(
        "Update selected year only accepts numbers, not callback functions."
      );

    setSelectedYear(year);
    filterViewableModels(year);
  };

  const updateSelectedUnit: VehiclesContextActions["updateSelectedUnit"] = (
    unit
  ) => {
    if (!unit) return setSelectedUnit(undefined);

    setSelectedUnit(unit);
  };

  const filterViewableYears = (selectedModelName?: string): void => {
    const filteredYears = selectedModelName
      ? Array.from(
          new Set(
            models
              .filter((model) => model.name === selectedModelName)
              .map((model) => new Date(model.year).getFullYear())
          )
        )
      : years;

    setViewableYears(filteredYears);
  };

  const filterViewableModels = (selectedYear?: number): void => {
    const filteredModels = selectedYear
      ? models.filter(
          (model) => new Date(model.year).getFullYear() === selectedYear
        )
      : models;

    setViewableModels(filteredModels);
  };

  const contextValue: VehiclesContextValue = {
    models,
    years,
    units,
    selectedModel,
    selectedYear,
    selectedUnit,
    viewableModels,
    viewableYears,
    updateSelectedModel,
    updateSelectedYear,
    updateSelectedUnit,
    offset,
    updateOffset,
  };

  return createElement(
    VehiclesContext.Provider,
    { value: contextValue },
    children
  );
};
