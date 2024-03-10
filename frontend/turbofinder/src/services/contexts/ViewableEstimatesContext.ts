import { createContext } from "react";

export interface ViewableEstimate {
  id: number;
  emissions_estimate: {
    id: number;
    model: {
      id: number;
      make: {
        id: number;
        name: string;
        uuid: string;
      };
      name: string;
      uuid: string;
      year: string;
    };
    estimated_at: string;
    estimated_by: number;
    carbon_grams?: string;
    distance_scale?: string;
    unit_id: number;
  };
  user: { id: number };
}

export interface ViewableEstimatesContextValue {
  viewableEstimates: ViewableEstimate[];
}

export const ViewableEstimatesContext = createContext<
  ViewableEstimatesContextValue | undefined
>(undefined);
