import { ReactNode, createElement, useEffect, useState } from "react";
import { getTurboApi } from "../api";
import { VehiclesContext } from "../contexts/VehiclesContext";

import {
  DistanceUnit,
  VehicleModel,
  VehiclesContextActions,
  VehiclesContextValue,
} from "../contexts/VehiclesContext";
import { GLOBAL_URLS } from "../global/urls";
import { handleErrors } from "../handleErrors";

interface VehiclesProviderProps {
  children: ReactNode;
}

export const VehiclesProvider: React.FC<VehiclesProviderProps> = ({
  children,
}) => {
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
      if (models.length === 0)
        try {
          const turboApi = getTurboApi();

          const vehicleModelsResponse = await turboApi.get(
            "/api/vehicle-make/2b1d0cd5-59be-4010-83b3-b60c5e5342da/models/",
            {
              data: {
                limit: 100, //below 200 limit
              },
            }
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
          handleErrors(
            error,
            "Something went wrong with VehicleContextProvider"
          );
        }
    };

    fetchData();
  }, [models, years, units]);

  const updateSelectedModel: VehiclesContextActions["updateSelectedModel"] = (
    model
  ) => {
    setSelectedModel(model);
    if (model) filterViewableYears(model.name);
  };

  const updateSelectedYear: VehiclesContextActions["updateSelectedYear"] = (
    year
  ) => {
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
  };

  return createElement(
    VehiclesContext.Provider,
    { value: contextValue },
    children
  );
};
