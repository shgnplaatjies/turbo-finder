import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBearerToken } from "../../../services/auth/auth.service";
import { APP_ROUTES } from "../../../services/global/urls";
import { useAuthenticationContext } from "../../../services/hooks/Authentication.hook";
import { useViewableEstimatesContext } from "../../../services/hooks/ViewableEstimates.hook";

const LoginPage: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const [warningText, setWarningText] = useState(
    "Something went wrong. Please try again"
  );

  const { refreshContext } = useViewableEstimatesContext();
  const { refreshAuth } = useAuthenticationContext();

  const handleLogin = async () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username) {
      setIsWarningVisible(true);
      setWarningText("Please enter a username");
      return;
    }

    if (!password) {
      setIsWarningVisible(true);
      setWarningText("Please enter a password");
      return;
    }

    const token = await getBearerToken({ username, password });

    if (token) {
      refreshContext();
      refreshAuth();
      navigate(APP_ROUTES.dashboard);
      window.location.reload();
    } else {
      setIsWarningVisible(true);
      setWarningText("Invalid login attempt. Please try again.");
    }
  };

  return (
    <main>
      <form>
        <h2>Login</h2>
        <label>
          Username:
          {/*
           */}
          <input type="text" id="username" ref={usernameRef} required />
        </label>
        <label>
          Password:
          {/*
           */}
          <input type="password" id="password1" ref={passwordRef} required />
        </label>
        {isWarningVisible && <p>{warningText}</p>}

        <button className="link-button" type="button" onClick={handleLogin}>
          Login
        </button>

        <p>
          Already have an account?{" "}
          <a tabIndex={0} onClick={() => navigate(APP_ROUTES.register)}>
            Register instead.
          </a>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
