import { createContext } from "react";

export interface AuthenticationStatus {
  isAuthenticated: boolean;
  authCookies: { bearerToken: string | null; csrfToken: string | null };
}

export interface AuthenticationContextValue {
  authStatus: AuthenticationStatus;
  refreshAuth: () => void;
}

export const AuthenticationContext = createContext<
  AuthenticationContextValue | undefined
>(undefined);
