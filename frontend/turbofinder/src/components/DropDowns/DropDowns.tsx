import React from "react";
import {
  DistanceUnit,
  VehicleModel,
} from "../../services/contexts/VehiclesContext";
import { useVehiclesContext } from "../../services/hooks/Vehicle.hook";
import AddEstimation from "../AddEstimate/AddEstimate";
import "./DropDowns.scss";

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
    { value: "", label: "Pick a Vehicle" },
    ...viewableModels.map((model: VehicleModel) => ({
      value: model.uuid,
      label: model.name,
    })),
  ];
  const yearOptions: Option[] = [
    { value: "", label: "Pick a Year" },
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
    <form className="drop-downs-container">
      <h3>Carbon Estimator</h3>
      <label htmlFor="modelSelect">Select a Model:</label>
      <select
        id="modelSelect"
        value={selectedModel?.uuid ?? ""}
        onChange={handleModelChange}
      >
        {modelOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label htmlFor="yearSelect">Select a Year:</label>
      <select
        id="yearSelect"
        value={selectedYear?.toString() ?? ""}
        onChange={handleYearChange}
      >
        {yearOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label htmlFor="unitSelect">Distance Unit:</label>
      <select
        id="unitSelect"
        value={selectedUnit?.symbol ?? ""}
        onChange={handleUnitChange}
      >
        {unitOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <AddEstimation />
    </form>
  );
};

export default DropDowns;
