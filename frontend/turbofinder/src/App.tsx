import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { VehiclesProvider } from "./services/context_providers/VehiclesContextProvider";
import { ViewableEstimatesProvider } from "./services/context_providers/ViewableEstimatesProvider";
import { useAuth } from "./services/hooks/auth.hook";

const App = () => {
  const isAuthenticated = useAuth();
  return (
    <VehiclesProvider>
      <ViewableEstimatesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={isAuthenticated ? <DashboardPage /> : <LoginPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ViewableEstimatesProvider>
    </VehiclesProvider>
  );
};

export default App;
