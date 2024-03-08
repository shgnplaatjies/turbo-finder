// src/components/EstimatesTable.tsx
import React from "react";
import { useViewableEstimatesContext } from "../../services/hooks/ViewableEstimates.hook";

const EstimatesTable: React.FC = () => {
  const { viewableEstimates } = useViewableEstimatesContext();

  return (
    <table className="viewableEstimates-table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Year</th>
          <th>Emissions</th>
        </tr>
      </thead>
      <tbody>
        {viewableEstimates.map((item) => (
          <tr key={item.id}>
            <td>{item.emissions_estimate.model.name}</td>
            <td>
              {new Date(item.emissions_estimate.model.year).getFullYear()}
            </td>
            <td>
              {item.emissions_estimate.carbon_grams !== undefined &&
              item.emissions_estimate.distance_scale !== undefined ? (
                <>{item.emissions_estimate.carbon_grams} </>
              ) : (
                <button type="button" id="createViewableEstimate">
                  Unlock | 3Cr
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EstimatesTable;
