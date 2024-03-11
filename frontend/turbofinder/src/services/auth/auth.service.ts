import axios from "axios";
import Cookies from "js-cookie";
import { GLOBAL_URLS } from "../global/urls";
import { handleErrors } from "../handleErrors";

interface BearerTokenProps {
  username: string;
  password: string;
}

export const getBearerToken = async ({
  username,
  password,
}: BearerTokenProps): Promise<string | 404> => {
  try {
    const response = await axios.post(
      `${GLOBAL_URLS.applicationRoot}${GLOBAL_URLS.getTokenUrl}`,
      { username, password }
    );
    const { token } = response.data;

    Cookies.set("BearerToken", token);

    if (token) return token;

    return 404;
  } catch (error) {
    handleErrors(error, "Something went wrong with login");
    return 404;
  }
};

export const checkBearerToken = async (token: string) => {
  const response = await axios.get(
    `${GLOBAL_URLS.applicationRoot}${GLOBAL_URLS.userCreditsList}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (response.status == 200) return true;

  return false;
};
