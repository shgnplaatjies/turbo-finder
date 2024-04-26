// Register.tsx
import Cookies from "js-cookie";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTurboApi } from "../../../services/api";
import { APP_ROUTES } from "../../../services/global/urls";
import { handleErrors } from "../../../services/handleErrors";
import "../AuthPage.scss";

const RegisterPage: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const password1Ref = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);

  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const navigate = useNavigate();

  const turboApi = getTurboApi();

  const handleRegister = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password1 = password1Ref.current?.value;
    const password2 = password2Ref.current?.value;

    try {
      const response = await turboApi.post("register/", {
        email,
        username,
        password1,
        password2,
      });

      if (
        response.status === 201 ||
        response.status === 204 ||
        response.status === 200
      ) {
        const responseCookies = response.headers["set-cookie"];

        responseCookies?.map((cookie) => {
          const [cookieName, cookieValue] = cookie.split(";")[0].split("=");
          Cookies.set(cookieName, cookieValue, { expires: 7 });
        });

        return navigate(APP_ROUTES.login);
      }

      setIsWarningVisible(true);
    } catch (error) {
      setIsWarningVisible(true);
      if (error) handleErrors(error, "Error during registration.");
      throw new Error("Something went wrong with registration");
    }
  };

  return (
    <main>
      <form className="auth-page register-page">
        <h2>Register</h2>
        <label>
          Username:{/**/}
          <input type="text" id="username" ref={usernameRef} required />
        </label>

        <label>
          Email:{/**/}
          <input type="email" id="email" ref={emailRef} required />
        </label>

        <label>
          Password:{/**/}
          <input type="password" id="password1" ref={password1Ref} required />
        </label>

        <label>
          Password (Confirm):{/**/}
          <input type="password" id="password2" ref={password2Ref} required />
        </label>
        {isWarningVisible ? (
          <p>Registration failed, please try again.</p>
        ) : (
          <></>
        )}

        <button type="button" onClick={handleRegister}>
          Register
        </button>
        <p>
          Already have an account?{" "}
          <span>
            <a onClick={() => navigate(APP_ROUTES.login)}>Login instead.</a>
          </span>
        </p>
      </form>
    </main>
  );
};

export default RegisterPage;
