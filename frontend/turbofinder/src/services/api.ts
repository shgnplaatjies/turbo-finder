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

const corsHeaders = {
  "Access-Control-Allow-Origin": getDjangoHostUrl(),
};

export const getTurboApi = () => {
  const authToken = Cookies.get("BearerToken");

  const turboApi = axios.create({
    baseURL: import.meta.env.VITE_DJANGO_URL,
    headers: authToken
      ? {
          ...corsHeaders,
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        }
      : {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
  });
  return turboApi;
};
