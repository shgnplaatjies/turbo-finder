import axios from "axios";
import Cookies from "js-cookie";
import { getDjangoHostUrl } from "./global/urls";

export const getCarbonApi = () =>
  axios.create({
    baseURL: import.meta.env.VITE_CARBON_INTERFACE_API_V1,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_CARBON_INTERFACE_API_KEY}`,
    },
  });

export const getTurboApi = () => {
  const authToken = Cookies.get("BearerToken");

  const csrfToken = Cookies.get("XSRF-TOKEN");

  const turboApi = axios.create({
    baseURL: getDjangoHostUrl(),
    headers: authToken
      ? {
          "X-XSRF-TOKEN": csrfToken,
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        }
      : {
          "X-XSRF-TOKEN": csrfToken,
          "Content-Type": "application/json",
        },
  });
  return turboApi;
};
