export const handleErrors = (error: unknown, productionMessage: string) => {
  if (process.env.NODE_ENV === "development") {
    if (error) {
      console.error("Unexpected Error:", error ?? "");
    }

    throw new Error("Something went wrong");
  }
  throw new Error(productionMessage);
};
