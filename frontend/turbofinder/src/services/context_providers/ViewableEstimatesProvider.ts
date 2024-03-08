import React, { ReactNode, createElement, useEffect, useState } from "react";
import { getTurboApi } from "../api";
import {
  ViewableEstimate,
  ViewableEstimatesContext,
  ViewableEstimatesContextValue,
} from "../contexts/ViewableEstimatesContext";
import { GLOBAL_URLS } from "../global/urls";
import { handleErrors } from "../handleErrors";

interface ViewableEstimatesProviderProps {
  children: ReactNode;
}

export const ViewableEstimatesProvider: React.FC<
  ViewableEstimatesProviderProps
> = ({ children }) => {
  const [viewableEstimates, setViewableEstimates] = useState<
    ViewableEstimate[]
  >([]);

  useEffect(() => {
    const fetchViewableEstimates = async () => {
      try {
        const turboApi = getTurboApi();
        const response = await turboApi.get(
          GLOBAL_URLS.viewableEmissionsEstimateAll
        );

        if (response.status === 200) {
          setViewableEstimates(response.data);
        }
      } catch (error) {
        handleErrors(error, "Error fetching Viewable ViewableEstimates");
      }
    };

    fetchViewableEstimates();
  }, []);

  const contextValue: ViewableEstimatesContextValue = {
    viewableEstimates,
  };

  return createElement(
    ViewableEstimatesContext.Provider,
    { value: contextValue },
    children
  );
};
