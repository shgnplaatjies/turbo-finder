import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { checkBearerToken } from "../auth/auth.service";

export const useAuth = (): boolean => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthenticated(false);

      const bearerToken = Cookies.get("BearerToken");

      if (!bearerToken) return;

      const checkBearer = await checkBearerToken(bearerToken);

      setAuthenticated(checkBearer);
    };

    verifyAuth();
  }, []);

  return isAuthenticated;
};
