import React from "react";
import {
  DistanceUnit,
  VehicleModel,
} from "../../services/contexts/VehiclesContext";
import { useVehiclesContext } from "../../services/hooks/Vehicle.hook";
import AddEstimation from "./AddEstimate";

interface Option {
  value: string;
  label: string;
}

const DropDowns: React.FC = () => {
  const {
    viewableModels,
    viewableYears,
    units,
    selectedModel,
    selectedYear,
    selectedUnit,
    updateSelectedModel,
    updateSelectedYear,
    updateSelectedUnit,
  } = useVehiclesContext();

  const modelOptions: Option[] = [
    { value: "", label: "-- Select --" },
    ...viewableModels.map((model: VehicleModel) => ({
      value: model.uuid,
      label: model.name,
    })),
  ];
  const yearOptions: Option[] = [
    { value: "", label: "-- Select --" },
    ...viewableYears.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    })),
  ];

  const unitOptions: Option[] = units.map((unit: DistanceUnit) => ({
    value: unit.symbol,
    label: unit.name,
  }));

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModelId = event.target.value;
    const selectedModel = viewableModels.find(
      (model) => model.uuid === selectedModelId
    );
    updateSelectedModel(selectedModel);
    updateSelectedYear(undefined); // Reset selectedYear when model changes
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value);
    updateSelectedYear(selectedYear);
  };

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnitSymbol = event.target.value;
    const selectedUnit = units.find(
      (unit) => unit.symbol === selectedUnitSymbol
    );
    updateSelectedUnit(selectedUnit);
  };

  return (
    <form className="drop-downs">
      <label>
        Select a Model:{/**/}
        <select value={selectedModel?.uuid ?? ""} onChange={handleModelChange}>
          {modelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Select a Year:{/**/}
        <select
          value={selectedYear?.toString() ?? ""}
          onChange={handleYearChange}
        >
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Distance Unit:{/**/}
        <select value={selectedUnit?.symbol ?? ""} onChange={handleUnitChange}>
          {unitOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <AddEstimation />
    </form>
  );
};

export default DropDowns;
