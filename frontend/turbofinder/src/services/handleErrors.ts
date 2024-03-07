export const handleErrors = (error: unknown, productionMessage: string) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Login failed", error);
    throw error;
  }
  throw new Error(productionMessage);
};
