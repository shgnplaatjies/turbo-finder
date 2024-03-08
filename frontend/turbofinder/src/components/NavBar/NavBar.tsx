import Cookies from "js-cookie";
import React from "react";
import { getTurboApi } from "../../services/api";
import { GLOBAL_URLS } from "../../services/global/urls";

const NavBar: React.FC = () => {
  const logout = async () => {
    const turboApi = getTurboApi();

    const response = await turboApi.post(GLOBAL_URLS.logoutUrl);

    if (response.status >= 200 && response.status <= 299) {
      Cookies.remove("BearerToken");
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <a>Logo</a>
        </li>
      </ul>
      <ul>
        <li>
          <a>Profile</a>
        </li>
        <li>
          <a onClick={logout}>Logout</a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
