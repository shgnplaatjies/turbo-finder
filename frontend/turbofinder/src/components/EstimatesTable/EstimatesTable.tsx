import { AxiosError, isAxiosError } from "axios";
import React, { useState } from "react";
import { getTurboApi } from "../../services/api";
import { ViewableEstimate } from "../../services/contexts/ViewableEstimatesContext";
import { getGlobalUrls } from "../../services/global/urls";
import { handleErrors } from "../../services/handleErrors";
import { useVehiclesContext } from "../../services/hooks/Vehicle.hook";
import { useViewableEstimatesContext } from "../../services/hooks/ViewableEstimates.hook";
import {
  gramsToOunces,
  kilometersToMiles,
} from "../../services/utils/unitConversion";
import UnlockModal from "../TurboModal/UnlockModal";

const EstimatesTable: React.FC = () => {
  const { viewableEstimates, refreshContext } = useViewableEstimatesContext();
  const { selectedUnit } = useVehiclesContext();
  const isMetric = selectedUnit?.symbol === "km";
  const defaultDistanceScale = 100;

  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [modalText, setModalText] = useState("Processing...");

  const addViewableEstimate = async (item: ViewableEstimate) => {
    const turboApi = getTurboApi();

    try {
      await turboApi.post(getGlobalUrls().viewableEmissionsEstimateGeneral, {
        emissions_estimate: { id: item.emissions_estimate.id },
      });

      setModalText("Success");
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response)
          switch (axiosError.response.status) {
            case 402:
              setModalText("Insufficient Funds.");
              break;

            case 409:
              setModalText("Conflict");
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
                setModalText("Failed");
                break;
              }
              setModalText("Unexpected Server Error");
              break;
          }
      }
      handleErrors(error, "Unexpected error occurred when adding.");
      setModalText("Unexpected Error");
    } finally {
      setIsUnlockModalOpen(true);
      refreshContext();
    }
  };

  const closeUnlockModal = () => setIsUnlockModalOpen(false);

  return (
    <div>
      <table className="viewableEstimates-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Year</th>
            <th>Emissions {isMetric ? "g" : "oz"}</th>
            <th>
              Distance {isMetric ? `/~${defaultDistanceScale}km` : `/~${62}mi`}
            </th>
          </tr>
        </thead>
        <tbody>
          {viewableEstimates.map((item) => (
            <tr key={item.id}>
              <td>{item.emissions_estimate.model.name}</td>
              <td>
                {new Date(item.emissions_estimate.model.year).getFullYear()}
              </td>
              {item.emissions_estimate.carbon_grams !== undefined &&
              item.emissions_estimate.distance_scale !== undefined ? (
                <>
                  <td>
                    {isMetric
                      ? item.emissions_estimate.carbon_grams
                      : gramsToOunces(
                          parseFloat(item.emissions_estimate.distance_scale)
                        ).toFixed(3)}{" "}
                  </td>
                  <td>
                    {isMetric
                      ? item.emissions_estimate.distance_scale
                      : kilometersToMiles(
                          parseFloat(item.emissions_estimate.distance_scale)
                        ).toFixed(3)}{" "}
                  </td>
                </>
              ) : (
                <>
                  <td>N/A</td>
                  <td>
                    <button
                      type="button"
                      id="createViewableEstimate"
                      onClick={() => addViewableEstimate(item)}
                    >
                      Unlock | 3Cr
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <UnlockModal
        isOpen={isUnlockModalOpen}
        onRequestClose={closeUnlockModal}
        modalText={modalText}
      />
    </div>
  );
};

export default EstimatesTable;
