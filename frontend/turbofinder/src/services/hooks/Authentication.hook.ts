import { useContext } from "react";
import {
  AuthenticationContext,
  AuthenticationContextValue,
} from "../contexts/AuthenticationContext";

export const useAuthenticationContext = (): AuthenticationContextValue => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error(
      "useAuthenticationContext must be used within a AuthenticationProvider"
    );
  }
  return context;
};
