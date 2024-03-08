/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const EstimatesTable: React.FC = () => {
  return (
    <table className="estimates-table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Year</th>
          <th>Emissions</th>
        </tr>
      </thead>
      <tbody>
        {/* {modelsList.map((item) => (
          <tr key={item.id}>
            <td>item.model.name</td>
            <td>item.model.year</td>
            <td>
              item.viewableEstimate ??{" "}
              <button type="button" id="createNewEstimate">
                Estimate | 5Cr
              </button>{" "}
              ??{" "}
              <button type="button" id="createViewableEstimate">
                Unlock | 3Cr
              </button>
            </td>
          </tr>
        ))} */}
      </tbody>
    </table>
  );
};

export default EstimatesTable;
