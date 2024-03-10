import { AxiosError, isAxiosError } from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import { getTurboApi } from "../../services/api";
import { GLOBAL_URLS } from "../../services/global/urls";
import { handleErrors } from "../../services/handleErrors";
import { useVehiclesContext } from "../../services/hooks/Vehicle.hook";
import { useViewableEstimatesContext } from "../../services/hooks/ViewableEstimates.hook";

const AddEstimation: React.FC = () => {
  const { selectedModel, selectedYear } = useVehiclesContext();
  const { refreshContext } = useViewableEstimatesContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const openModal = (message: string) => {
    setModalMessage(message);
    setModalIsOpen(true);
  };

  const afterModalClose = () => {
    setModalMessage("");
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

      await turboApi.post(GLOBAL_URLS.emissionsEstimateGeneral, {
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
    <div>
      <button
        type="button"
        onClick={addEstimate}
        className="add-estimate-component"
      >
        Estimate | 5 Cr
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={afterModalClose}
        contentLabel="Example Modal"
      >
        <h2>{modalMessage}</h2>
        <button onClick={afterModalClose}>Close</button>
      </Modal>
    </div>
  );
};

export default AddEstimation;
