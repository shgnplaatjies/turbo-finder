import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import { VehiclesProvider } from "./services/context_providers/VehiclesContextProvider";
import { useAuth } from "./services/hooks/auth.hook";

const App = () => {
  const isAuthenticated = useAuth();
  return (
    <VehiclesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={isAuthenticated ? <DashboardPage /> : <LoginPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </VehiclesProvider>
  );
};

export default App;
