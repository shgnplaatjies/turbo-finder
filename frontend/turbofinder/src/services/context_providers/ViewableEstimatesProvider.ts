import React, { ReactNode, createElement, useEffect, useState } from "react";
import { getGlobalUrls } from "../../services/global/urls";
import { getTurboApi } from "../api";
import {
  ViewableEstimate,
  ViewableEstimatesContext,
  ViewableEstimatesContextValue,
} from "../contexts/ViewableEstimatesContext";
import { handleErrors } from "../handleErrors";
import { useAuthenticationContext } from "../hooks/Authentication.hook";

interface ViewableEstimatesProviderProps {
  children: ReactNode;
}

export const ViewableEstimatesProvider: React.FC<
  ViewableEstimatesProviderProps
> = ({ children }) => {
  const [viewableEstimates, setViewableEstimates] = useState<
    ViewableEstimate[]
  >([]);

  const [refresh, setRefresh] = useState(false);

  const { authStatus } = useAuthenticationContext();

  const fetchViewableEstimates = async () => {
    try {
      const turboApi = getTurboApi();

      const response = await turboApi.get(
        getGlobalUrls().viewableEmissionsEstimateAll
      );

      if (response.status === 200) {
        setViewableEstimates(response.data);
      }
    } catch (error) {
      handleErrors(error, "Error fetching Viewable ViewableEstimates");
    }
  };

  const refreshContext = () => setRefresh((prev) => !prev);

  useEffect(() => {
    if (authStatus.isAuthenticated) fetchViewableEstimates();
  }, [refresh, authStatus]);

  const contextValue: ViewableEstimatesContextValue = {
    viewableEstimates,
    refreshContext,
  };

  return createElement(
    ViewableEstimatesContext.Provider,
    { value: contextValue },
    children
  );
};
