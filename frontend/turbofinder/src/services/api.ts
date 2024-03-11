import axios from "axios";
import Cookies from "js-cookie";

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

  const turboApi = axios.create({
    baseURL: import.meta.env.VITE_DJANGO_URL,
    headers: authToken
      ? {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        }
      : { "Content-Type": "application/json" },
  });

  return turboApi;
};
