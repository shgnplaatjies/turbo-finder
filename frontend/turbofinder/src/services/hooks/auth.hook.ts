import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { checkBearerToken } from "../auth/auth.service";

export const useAuth = (): boolean => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const bearerToken = Cookies.get("BearerToken");

      if (!bearerToken) {
        setAuthenticated(false);
        return;
      }

      const isAuthenticated = await checkBearerToken(bearerToken);
      setAuthenticated(isAuthenticated);
    };

    verifyAuth();
  }, []);

  return authenticated;
};
