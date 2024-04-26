import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";
import ChevronIcon from "../../assets/Chevron/Chevron";
import LogoIcon from "../../assets/Logo/Logo";
import { getTurboApi } from "../../services/api";
import { APP_ROUTES, GLOBAL_URLS } from "../../services/global/urls";
import "./NavBar.scss";

const NavBar: React.FC = () => {
  const logout = async () => {
    const turboApi = getTurboApi();

    const response = await turboApi.post(GLOBAL_URLS.logoutUrl);

    if (response.status >= 200 && response.status <= 299) {
      Cookies.remove("BearerToken");
      window.location.reload();
    }
  };

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button type="button" onClick={() => navigate(-1)} aria-label="Go back">
        <ChevronIcon />
      </button>
      <button
        type="button"
        onClick={() => navigate(APP_ROUTES.dashboard)}
        aria-label="Go to homepage"
      >
        <LogoIcon />
      </button>
      <button type="button" onClick={() => navigate(APP_ROUTES.profile)}>
        Profile
      </button>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
