import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.CARBON_INTERFACE_API_V1}`,
});
