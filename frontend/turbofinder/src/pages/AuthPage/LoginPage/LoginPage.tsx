// Login.tsxauth-page login-page
import Cookies from "js-cookie";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTurboApi } from "../../../services/api";
import { APP_ROUTES } from "../../../services/global/urls";
import { handleErrors } from "../../../services/handleErrors";
import "../AuthPage.scss";

const LoginPage: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [isWarningVisible, setWarningVisible] = useState(false);

  const navigate = useNavigate();

  const turboApi = getTurboApi();

  const handleLogin = async () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await turboApi.post("login/", {
        username,
        password,
      });

      if (
        response.status === 201 ||
        response.status === 204 ||
        response.status === 200
      ) {
        const responseCookies = response.headers["set-cookie"];

        if (responseCookies && responseCookies.length !== 0)
          responseCookies.map((cookie) => {
            const [cookieName, cookieValue] = cookie.split(";")[0].split("=");
            Cookies.set(cookieName, cookieValue, { expires: 7 });
          });

        const { key } = response.data;

        Cookies.set("BearerToken", key, {
          expires: 7,
          sameSite: "None",
          secure: import.meta.env.MODE !== "development",
        });

        navigate(APP_ROUTES.dashboard, { replace: true });
        // window.location.reload();
        return;
      }

      setWarningVisible(true);
    } catch (error) {
      setWarningVisible(true);
      if (error) handleErrors(error, "Error during registration.");
      throw new Error("Something went wrong with registration");
    }
  };

  return (
    <main>
      <form>
        <h2>Login</h2>
        <label>
          Username:
          <input type="text" id="username" ref={usernameRef} required />
        </label>

        <label>
          Password:
          <input type="password" id="password1" ref={passwordRef} required />
        </label>

        {isWarningVisible ? (
          <p>Something went wrong. Please try again</p>
        ) : (
          <></>
        )}

        <button type="button" onClick={handleLogin}>
          Login
        </button>

        <p>
          Already have an account?{" "}
          <span>
            <a onClick={() => navigate(APP_ROUTES.register)}>
              Register instead.
            </a>
          </span>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
