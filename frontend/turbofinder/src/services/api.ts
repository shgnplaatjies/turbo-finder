import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NODE_URL}`,
});
