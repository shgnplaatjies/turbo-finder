import { AxiosError, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import UnlockModal from "../../components/TurboModal/UnlockModal";
import { getTurboApi } from "../../services/api";
import { ERROR_MESSAGES } from "../../services/constants/errorMessages";
import { getGlobalUrls } from "../../services/global/urls";
import { handleErrors } from "../../services/handleErrors";
import "./ProfilePage.scss";
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
        const userInfoResponse = await turboApi.get(
          getGlobalUrls().userInfoList
        );

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
        getGlobalUrls().userCreditsRetrieve
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
    <main className="profile-page-container">
      <h2>Welcome Home, {userInfo?.username}</h2>
      <p>Email: {userInfo?.email}</p>
      <form>
        <h3>Purchase 5 Credits below:</h3>
        <p>Available Credits: {credits}</p>
        <button type="button" onClick={purchaseCredits}>
          Buy Now
        </button>
      </form>

      {modalIsOpen && (
        <UnlockModal
          isOpen={modalIsOpen}
          onRequestClose={afterModalClose}
          modalText={modalText}
        />
      )}
    </main>
  );
};

export default ProfilePage;
