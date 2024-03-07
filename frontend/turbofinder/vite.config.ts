import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      "process.env.NODE_HOST": JSON.stringify(env.NODE_HOST),
      "process.env.NODE_PORT": JSON.stringify(env.NODE_PORT),
      "process.env.DJANGO_ENV": JSON.stringify(env.DJANGO_ENV),
      "process.env.DJANGO_HOST": JSON.stringify(env.DJANGO_HOST),
      "process.env.DJANGO_PORT": JSON.stringify(env.DJANGO_PORT),
      "process.env.DB_NAME": JSON.stringify(env.DB_NAME),
      "process.env.DB_USER": JSON.stringify(env.DB_USER),
      "process.env.DB_PASSWORD": JSON.stringify(env.DB_PASSWORD),
      "process.env.DB_HOST": JSON.stringify(env.DB_HOST),
      "process.env.DB_PORT": JSON.stringify(env.DB_PORT),
      "process.env.SUPERUSER_NAME": JSON.stringify(env.SUPERUSER_NAME),
      "process.env.SUPERUSER_PASSWORD": JSON.stringify(env.SUPERUSER_PASSWORD),
      "process.env.CARBON_INTERFACE_API_KEY": JSON.stringify(
        env.CARBON_INTERFACE_API_KEY
      ),
      "process.env.CARBON_INTERFACE_API_V1": JSON.stringify(
        env.CARBON_INTERFACE_API_V1
      ),
      "process.env.THROTTLE_RATE": JSON.stringify(env.THROTTLE_RATE),
      "process.env.BEARER_REQUEST_URL": JSON.stringify(env.BEARER_REQUEST_URL),
      "process.env.BEARER_TOKEN": JSON.stringify(env.BEARER_TOKEN),
      "process.env.BEARER_TOKEN_PREFIX": JSON.stringify(
        env.BEARER_TOKEN_PREFIX
      ),
      "process.env.TEMP_USER_PASSWORD": JSON.stringify(env.TEMP_USER_PASSWORD),
      "process.env.TEMP_USER_NAME": JSON.stringify(env.TEMP_USER_NAME),
    },
    plugins: [react()],
    build: {
      outDir: "static",
      rollupOptions: {
        output: {
          entryFileNames: "main.js",

          chunkFileNames: "chunk.js",

          assetFileNames: "assets/[name].[ext]",
        },
      },
    },
  };
});
