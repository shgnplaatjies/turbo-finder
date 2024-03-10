import { AxiosError, isAxiosError } from "axios";
import React from "react";
import { getTurboApi } from "../../services/api";
import { GLOBAL_URLS } from "../../services/global/urls";
import { handleErrors } from "../../services/handleErrors";
import { useVehiclesContext } from "../../services/hooks/Vehicle.hook";

const AddEstimation: React.FC = () => {
  const { selectedModel, selectedYear } = useVehiclesContext();

  const addEstimate = async () => {
    if (!selectedModel) return console.log("Please select vehicle model.");
    if (!selectedYear) return console.log("Please select vehicle year.");

    try {
      const turboApi = getTurboApi();

      await turboApi.post(GLOBAL_URLS.emissionsEstimateGeneral, {
        uuid: selectedModel.uuid,
      });

      window.location.reload();
      console.log("Success");
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response)
          switch (axiosError.response.status) {
            case 402:
              console.log("Insufficient Funds.");
              break;

            case 409:
              console.log("Conflict");
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
                console.log("Failed");
                break;
              }
              console.log("Unexpected Server Error");
              break;
          }
      }
      handleErrors(error, "Unexpected error occured when adding.");
      console.log("Unexpected Error");
    }
  };

  return (
    <button
      type="button"
      onClick={addEstimate}
      className="add-estimate-component"
    >
      Estimate | 5 Cr
    </button>
  );
};

export default AddEstimation;
