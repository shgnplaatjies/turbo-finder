import { AxiosError, isAxiosError } from "axios";
import React, { useState } from "react";
import { getTurboApi } from "../../services/api";
import { ViewableEstimate } from "../../services/contexts/ViewableEstimatesContext";
import { GLOBAL_URLS } from "../../services/global/urls";
import { handleErrors } from "../../services/handleErrors";
import { useViewableEstimatesContext } from "../../services/hooks/ViewableEstimates.hook";

const EstimatesTable: React.FC = () => {
  const { viewableEstimates } = useViewableEstimatesContext();
  console.log(viewableEstimates);

  const defaultModalText = "Unlock | 3Cr";
  const [unlockModalText, setUnlockModalText] = useState(defaultModalText);

  const addViewableEstimate = async (item: ViewableEstimate) => {
    const turboApi = getTurboApi();

    try {
      await turboApi.post(GLOBAL_URLS.viewableEmissionsEstimateGeneral, {
        emissions_estimate: { id: item.emissions_estimate.id },
      });

      window.location.reload();
      setUnlockModalText("Success");
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response)
          switch (axiosError.response.status) {
            case 402:
              setUnlockModalText("Insufficient Funds.");
              break;

            case 409:
              setUnlockModalText("Conflict");
              break;

            default:
              if (
                axiosError.response.status >= 400 &&
                axiosError.response.status < 500
              ) {
                handleErrors(
                  axiosError.response.status,
                  "Unexpectedly failed to add estimate."
                );
                setUnlockModalText("Failed");
                break;
              }
              setUnlockModalText("Unexpected Server Error");
              break;
          }
      }
      handleErrors(error, "Unexpected error occured when adding.");
      setUnlockModalText("Unexpected Error");
    }
  };

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
                <button
                  type="button"
                  id="createViewableEstimate"
                  onClick={() => addViewableEstimate(item)}
                >
                  {unlockModalText}
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
