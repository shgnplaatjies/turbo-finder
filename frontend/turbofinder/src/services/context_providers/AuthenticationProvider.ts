import Cookies from "js-cookie";
import React, { ReactNode, createElement, useEffect, useState } from "react";
import {
  AuthenticationContext,
  AuthenticationContextValue,
  AuthenticationStatus,
} from "../contexts/AuthenticationContext";

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>({
    isAuthenticated: false,
    authCookies: { bearerToken: null, csrfToken: null },
  });

  const [refresh, setRefresh] = useState(false);

  const verifyAuth = async () => {
    const bearerToken = Cookies.get("BearerToken");

    const csrfToken = Cookies.get("XSRF-TOKEN");

    if (bearerToken) {
      setAuthStatus({
        isAuthenticated: true,
        authCookies: { bearerToken: bearerToken, csrfToken: csrfToken ?? null },
      });
    } else {
      setAuthStatus({
        isAuthenticated: false,
        authCookies: { bearerToken: null, csrfToken: null },
      });
    }
  };

  const refreshAuth = () => setRefresh((prev) => !prev);

  useEffect(() => {
    verifyAuth();
  }, [refresh]);

  const contextValue: AuthenticationContextValue = {
    authStatus,
    refreshAuth,
  };

  return createElement(
    AuthenticationContext.Provider,
    { value: contextValue },
    children
  );
};
