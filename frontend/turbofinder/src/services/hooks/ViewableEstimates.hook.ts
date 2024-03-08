import { useContext } from "react";
import {
  ViewableEstimatesContext,
  ViewableEstimatesContextValue,
} from "../contexts/ViewableEstimatesContext";

export const useViewableEstimatesContext =
  (): ViewableEstimatesContextValue => {
    const context = useContext(ViewableEstimatesContext);
    if (!context) {
      throw new Error(
        "useViewableEstimatesContext must be used within an ViewableEstimatesProvider"
      );
    }
    return context;
  };
