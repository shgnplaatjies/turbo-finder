import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getTurboApi } from "../../services/api";
import { GLOBAL_URLS } from "../../services/global/urls";
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
      <ul>
        <li>
          <button type="button">Logo</button>
        </li>
      </ul>
      <ul>
        <li>
          <button type="button" onClick={() => navigate("/profile")}>
            Profile
          </button>
        </li>
        <li>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
