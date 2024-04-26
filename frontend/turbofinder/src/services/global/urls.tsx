export const DJANGO_URLS = {
  dev: `${import.meta.env.VITE_DJANGO_URL_DEV}`,
  qa: `${import.meta.env.VITE_DJANGO_URL_QA}`,
  stg: `${import.meta.env.VITE_DJANGO_URL_STG}`,
  prod: `${import.meta.env.VITE_DJANGO_URL_PROD}`,
} as const;

export const getGlobalUrls = () =>
  ({
    applicationRoot: `${getDjangoHostUrl()}`,
    getTokenUrl: `api/token/`,
    logoutUrl: `logout/`,
    loginUrl: `login/`,
    registerUrl: `register/`,
    vehicleModelsRetrieve: `api/vehicle-make/${TOYOTA_UUID}/models/`,
    vehicleMakesGeneral: `api/vehicle-makes/`,
    vehicleMakesRetrieve: `api/vehicle-makes/:pk/`,
    distanceUnitsGeneral: `api/distance-units/`,
    distanceUnitsRetrieve: `api/distance-units/:pk/`,
    userCreditsRetrieve: `api/user/add-credits/`,
    userCreditsList: `api/user/credits/`,
    userInfoList: `api/user/info/`,
    emissionsEstimateGeneral: `api/emission-estimate/`,
    viewableEmissionsEstimateGeneral: `api/viewable-emission-estimates/`,
    viewableEmissionsEstimateRetrieve: `api/viewable-emission-estimates/:pk/`,
    viewableEmissionsEstimateAll: `api/viewable-emission-estimates/all/`,
  } as const);

export const APP_ROUTES = {
  login: "/login",
  register: "/register",
  dashboard: "/",
  profile: "/profile",
  notFound: "*",
} as const;

export const TOYOTA_UUID = "2b1d0cd5-59be-4010-83b3-b60c5e5342da";

export const getDjangoHostUrl = () => {
  const env = import.meta.env.VITE_NODE_ENV;
  switch (env) {
    case env === "development":
      return DJANGO_URLS.dev as string;

    case env === "qa":
      return DJANGO_URLS.qa as string;

    case env === "stg":
      return DJANGO_URLS.stg as string;

    case env === "prod":
      return DJANGO_URLS.prod as string;

    default:
      return DJANGO_URLS.dev as string;
  }
};
