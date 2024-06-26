import { AxiosError, isAxiosError } from "axios";
import React, { useState } from "react";
import { getTurboApi } from "../../services/api";
import { getGlobalUrls } from "../../services/global/urls";
import { handleErrors } from "../../services/handleErrors";
import { useVehiclesContext } from "../../services/hooks/Vehicle.hook";
import { useViewableEstimatesContext } from "../../services/hooks/ViewableEstimates.hook";
import UnlockModal from "../TurboModal/UnlockModal";
import "./AddEstimate.scss";

const AddEstimation: React.FC = () => {
  const { selectedModel, selectedYear } = useVehiclesContext();
  const { refreshContext } = useViewableEstimatesContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const openModal = (message: string) => {
    setModalText(message);
    setModalIsOpen(true);
  };

  const afterModalClose = () => {
    setModalText("");
    setModalIsOpen(false);
  };

  const addEstimate = async () => {
    if (!selectedModel) {
      openModal("Please select vehicle model.");
      return;
    }
    if (!selectedYear) {
      openModal("Please select vehicle year.");
      return;
    }

    try {
      const turboApi = getTurboApi();

      await turboApi.post(getGlobalUrls().emissionsEstimateGeneral, {
        uuid: selectedModel.uuid,
      });

      refreshContext();
      openModal("Success");
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response)
          switch (axiosError.response.status) {
            case 402:
              openModal("Insufficient Funds.");
              break;

            case 409:
              openModal("Conflict");
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
                openModal("Failed");
                break;
              }
              openModal("Unexpected Server Error");
              break;
          }
      }
      handleErrors(error, "Unexpected error occurred when adding.");
      openModal("Unexpected Error");
    }
  };

  return (
    <article className="add-estimate-container">
      <button
        type="button"
        onClick={addEstimate}
        className="add-estimate-container"
      >
        Estimate | 5 Cr
      </button>

      {modalIsOpen && (
        <UnlockModal
          isOpen={modalIsOpen}
          onRequestClose={afterModalClose}
          modalText={modalText}
          contentLabel="Adding Estimate"
        />
      )}
    </article>
  );
};

export default AddEstimation;
