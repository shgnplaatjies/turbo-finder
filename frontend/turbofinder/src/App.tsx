import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import LogoIcon from "./assets/Logo/Logo";
import NavBar from "./components/NavBar/NavBar";
import LoginPage from "./pages/AuthPage/LoginPage/LoginPage";
import RegisterPage from "./pages/AuthPage/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { AuthenticationProvider } from "./services/context_providers/AuthenticationProvider";
import { VehiclesProvider } from "./services/context_providers/VehiclesContextProvider";
import { ViewableEstimatesProvider } from "./services/context_providers/ViewableEstimatesProvider";
import { APP_ROUTES } from "./services/global/urls";
import { useAuth } from "./services/hooks/auth.hook";

const App = () => {
  const isAuthenticated = useAuth();
  return (
    <AuthenticationProvider>
      <VehiclesProvider>
        <ViewableEstimatesProvider>
          <BrowserRouter basename="/react">
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
              <Route path={APP_ROUTES.login} element={<LoginPage />} />
              <Route path={APP_ROUTES.register} element={<RegisterPage />} />
              {isAuthenticated && (
                <>
                  <Route
                    path={APP_ROUTES.dashboard}
                    element={<DashboardPage />}
                  />
                  <Route path={APP_ROUTES.profile} element={<ProfilePage />} />
                </>
              )}
              {isAuthenticated ? (
                <Route path={APP_ROUTES.notFound} element={<NotFoundPage />} />
              ) : (
                <Route path={APP_ROUTES.notFound} element={<LoginPage />} />
              )}
            </Routes>
          </BrowserRouter>
        </ViewableEstimatesProvider>
      </VehiclesProvider>
    </AuthenticationProvider>
  );
};

export default App;
