export const GLOBAL_URLS = {
  applicationRoot: "http://127.0.0.1:8000/",
  getTokenUrl: "api/token/",
  logoutUrl: "logout/",
  registerUrl: "register/",
  vehicleModelsRetrieve: "api/vehicle-make/:make_uuid/models/",
  vehicleMakesGeneral: "api/vehicle-makes/",
  vehicleMakesRetrieve: "api/vehicle-makes/:pk/",
  distanceUnitsGeneral: "api/distance-units/",
  distanceUnitsRetrieve: "api/distance-units/:pk/",
  userCreditsRetrieve: "api/user/add-credits/",
  userCreditsList: "api/user/credits/",
  userInfoList: "api/user/info/",
  emissionsEstimateGeneral: "api/emission-estimate/",
  viewableEmissionsEstimateGeneral: "api/viewable-emission-estimates/",
  viewableEmissionsEstimateRetrieve: "api/viewable-emission-estimates/:pk/",
  viewableEmissionsEstimateAll: "api/viewable-emission-estimates/all/",
};

export const APP_ROUTES = {
  login: "/login",
  register: "/register",
  dashboard: "/",
  profile: "/profile",
  notFound: "*",
};

export const TOYOTA_UUID = "2b1d0cd5-59be-4010-83b3-b60c5e5342da";

export const DJANGO_URLS = {
  dev: `${import.meta.env.VITE_DJANGO_URL_DEV}`,
  qa: `${import.meta.env.VITE_DJANGO_URL_QA}`,
  stg: `${import.meta.env.VITE_DJANGO_URL_STG}`,
  prod: `${import.meta.env.VITE_DJANGO_URL_PROD}`,
};

export const getDjangoHostUrl = () => {
  const env = import.meta.env.VITE_NODE_ENV;
  switch (env) {
    case env === "development":
      return DJANGO_URLS.dev;

    case env === "qa":
      return DJANGO_URLS.qa;

    case env === "stg":
      return DJANGO_URLS.stg;

    case env === "prod":
      return DJANGO_URLS.prod;

    default:
      return DJANGO_URLS.dev;
  }
};
