import axios from "axios";
import Cookies from "js-cookie";
import { getGlobalUrls } from "../global/urls";
import { handleErrors } from "../handleErrors";

export const getBearerToken = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${getGlobalUrls().applicationRoot}${getGlobalUrls().getTokenUrl}`,
      { username, password }
    );

    const { token } = response.data;

    if (token) {
      Cookies.set("BearerToken", token, {
        expires: 7,
        sameSite: "None",
        secure: import.meta.env.MODE !== "development",
      });

      return token;
    }

    return null;
  } catch (error) {
    handleErrors(error, "Something went wrong with login");
    return null;
  }
};

export const checkBearerToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${getGlobalUrls().applicationRoot}${getGlobalUrls().userCreditsList}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    return false;
  }
};
