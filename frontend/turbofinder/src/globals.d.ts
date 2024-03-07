declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      NODE_HOST?: string;
      NODE_PORT?: string;
      DJANGO_ENV?: string;
      DJANGO_HOST?: string;
      DJANGO_PORT?: string;
      DB_NAME?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_HOST?: string;
      DB_PORT?: string;
      SUPERUSER_NAME?: string;
      SUPERUSER_PASSWORD?: string;
      CARBON_INTERFACE_API_KEY?: string;
      CARBON_INTERFACE_API_V1?: string;
      THROTTLE_RATE?: string;
      BEARER_REQUEST_URL?: string;
      BEARER_TOKEN?: string;
      BEARER_TOKEN_PREFIX?: string;
      TEMP_USER_PASSWORD?: string;
      TEMP_USER_NAME?: string;
    }
  }
}

interface Window {
  NODE_ENV?: string;
  NODE_HOST?: string;
  NODE_PORT?: string;

  DJANGO_ENV?: string;
  DJANGO_HOST?: string;
  DJANGO_PORT?: string;

  DB_NAME?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_HOST?: string;
  DB_PORT?: string;

  SUPERUSER_NAME?: string;
  SUPERUSER_PASSWORD?: string;

  CARBON_INTERFACE_API_KEY?: string;
  CARBON_INTERFACE_API_V1?: string;

  THROTTLE_RATE?: string;

  BEARER_REQUEST_URL?: string;
  BEARER_TOKEN?: string;
  BEARER_TOKEN_PREFIX?: string;

  TEMP_USER_PASSWORD?: string;
  TEMP_USER_NAME?: string;
}
