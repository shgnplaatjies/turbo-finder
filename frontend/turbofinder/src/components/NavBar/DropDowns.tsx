import React, { useState } from "react";

const DropDowns: React.FC = () => {
  const modelOptions = [
    { value: "model.id", label: "model.name" },
    { value: "45", label: "Celica" },
  ];

  const yearOptions = [
    { value: "model.id", label: "model.year" },
    { value: "56", label: "1994" },
  ];

  const unitOptions = [
    { value: "distanceUnit.symbol", label: "distanceUnit.name" },
    { value: "mi", label: "miles" },
  ];

  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedModel(event.target.value);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedYear(event.target.value);

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedUnit(event.target.value);

  return (
    <div className="drop-downs">
      <label>
        Select a Model:
        <select value={selectedModel} onChange={handleModelChange}>
          <option value="">-- Select --</option>
          {modelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Select a Year:
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="">-- Select --</option>
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Distance Unit:
        <select value={selectedUnit} onChange={handleUnitChange}>
          <option value="">-- Select --</option>
          {unitOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default DropDowns;
