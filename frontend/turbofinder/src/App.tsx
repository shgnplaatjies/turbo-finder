import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import LogoIcon from "./assets/Logo/Logo";
import NavBar from "./components/NavBar/NavBar";
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
          {isAuthenticated ? (
            <header>
              <NavBar />
            </header>
          ) : (
            <header>
              <div className="logo-icon">
                <LogoIcon />
              </div>
            </header>
          )}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {isAuthenticated && (
              <>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </>
            )}
            {isAuthenticated ? (
              <Route path="*" element={<NotFoundPage />} />
            ) : (
              <Route path="*" element={<LoginPage />} />
            )}
          </Routes>
        </BrowserRouter>
      </ViewableEstimatesProvider>
    </VehiclesProvider>
  );
};

export default App;
