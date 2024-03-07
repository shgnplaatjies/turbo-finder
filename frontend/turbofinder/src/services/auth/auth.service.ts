import axios from "axios";
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
    // Add to user's cookies
    if (token) return token;

    return 404;
  } catch (error) {
    handleErrors(error, "Something went wrong with login");
    return 404;
  }
};
