import { AxiosError, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import UnlockModal from "./src/components/TurboModal/UnlockModal";
import { getTurboApi } from "./src/services/api";
import { ERROR_MESSAGES } from "./src/services/constants/errorMessages";
import { GLOBAL_URLS } from "./src/services/global/urls";
import { handleErrors } from "./src/services/handleErrors";

interface UserInfoProps {
  id: number;
  credits: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const ProfilePage: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>("");
  const [credits, setCredits] = useState<number | undefined>();
  const [userInfo, setUserInfo] = useState<UserInfoProps>();

  const openModal = (message: string) => {
    setModalText(message);
    setModalIsOpen(true);
  };

  const afterModalClose = () => {
    setModalText("");
    setModalIsOpen(false);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const turboApi = getTurboApi();
        const userInfoResponse = await turboApi.get(GLOBAL_URLS.userInfoList);

        setUserInfo(userInfoResponse.data[0]);
        setCredits(userInfoResponse.data[0].credits);
      } catch (error) {
        if (isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (!axiosError?.response?.status)
            return handleErrors(error, ERROR_MESSAGES.general);

          return handleErrors(axiosError, ERROR_MESSAGES.general);
        }
        return handleErrors(error, ERROR_MESSAGES.general);
      }
    };

    getUserInfo();
  }, []);

  const purchaseCredits = async () => {
    try {
      const turboApi = getTurboApi();

      const creditsResponse = await turboApi.patch(
        GLOBAL_URLS.userCreditsRetrieve
      );

      setCredits(creditsResponse.data.credits);

      openModal("Success");
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (!axiosError?.response?.status)
          return handleErrors(error, ERROR_MESSAGES.general);

        const statusCode = axiosError.response.status;
        if (statusCode === 402) openModal("Insufficient Funds.");

        if (statusCode >= 400 || statusCode < 500) {
          handleErrors(axiosError.response.status, "Unexpectedly failed.");
          openModal("Failed");
        }
      }
    }
  };

  return (
    <>
      <h2>Welcome Home, {userInfo?.username}</h2>
      <p>Email: {userInfo?.email}</p>
      <form>
        <h3>Purchase 5 Credits below:</h3>
        <p>Available Credits: {credits}</p>
        <button type="button" onClick={purchaseCredits}>
          Buy Now
        </button>
      </form>

      <UnlockModal
        isOpen={modalIsOpen}
        onRequestClose={afterModalClose}
        modalText={modalText}
      />
    </>
  );
};

export default ProfilePage;
