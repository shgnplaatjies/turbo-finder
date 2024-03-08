export const handleErrors = (error: unknown, productionMessage: string) => {
  if (process.env.NODE_ENV === "development") {
    if (error) {
      console.error("Login failed", error ?? "");
      throw error;
    }

    throw new Error("Something went wrong");
  }
  throw new Error(productionMessage);
};
