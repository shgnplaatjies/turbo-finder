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
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
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
        console.log("models", models, "years", years, "units", units);
        console.log(
          "models",
          modelsData,
          "years",
          uniqueYears,
          "units",
          unitsData
        );
      } catch (error) {
        handleErrors(error, "Something went wrong with VehicleContextProvider");
      }
    };

    fetchData();
  }, []);

  const updateSelectedModel: VehiclesContextActions["updateSelectedModel"] = (
    model
  ) => {
    setSelectedModel(model);
  };

  const updateSelectedYear: VehiclesContextActions["updateSelectedYear"] = (
    year
  ) => {
    setSelectedYear(year);
  };

  const updateSelectedUnit: VehiclesContextActions["updateSelectedUnit"] = (
    unit
  ) => {
    setSelectedUnit(unit);
  };

  const contextValue: VehiclesContextValue = {
    models,
    years,
    units,
    selectedModel,
    selectedYear,
    selectedUnit,
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
