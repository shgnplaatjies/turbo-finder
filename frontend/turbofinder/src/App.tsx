import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/AuthPage/LoginPage/LoginPage";
import RegisterPage from "./pages/AuthPage/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
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
