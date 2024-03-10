import React from "react";
import { createRoot } from "react-dom/client";
import ReactModal from "react-modal";
import App from "./App.tsx";
import "./index.css";

const main = () => {
  ReactModal.setAppElement("#root");
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

main();
