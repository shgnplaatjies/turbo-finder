import { ReactNode, createElement, useEffect, useState } from "react";
import { getGlobalUrls } from "../../services/global/urls";
import { getTurboApi } from "../api";
import {
  DistanceUnit,
  VehicleModel,
  VehiclesContext,
  VehiclesContextActions,
  VehiclesContextValue,
} from "../contexts/VehiclesContext";
import { handleErrors } from "../handleErrors";
import { useAuthenticationContext } from "../hooks/Authentication.hook";

interface VehiclesProviderProps {
  children: ReactNode;
}

export const VehiclesProvider: React.FC<VehiclesProviderProps> = ({
  children,
}) => {
  const { authStatus } = useAuthenticationContext();

  const [refresh, setRefresh] = useState<boolean>(false);

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

  const fetchData = async (offsetValue: number) => {
    try {
      const turboApi = getTurboApi();

      const vehicleModelsResponse = await turboApi.get(
        getGlobalUrls().vehicleModelsRetrieve,
        { data: { limit: offsetStep, offset: offsetValue } }
      );

      const unitsResponse = await turboApi.get(
        getGlobalUrls().distanceUnitsGeneral
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

      setSelectedUnit(unitsData[0]);

      setViewableModels(modelsData);
      setViewableYears(uniqueYears);
    } catch (error) {
      handleErrors(error, "Something went wrong with VehicleContextProvider");
    }
  };

  const refreshContext = () => setRefresh((prev) => !prev);

  useEffect(() => {
    if (authStatus.isAuthenticated) fetchData(offset);
  }, [offset, refresh, authStatus]);

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
    refreshContext,
  };

  return createElement(
    VehiclesContext.Provider,
    { value: contextValue },
    children
  );
};
