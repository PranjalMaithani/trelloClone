import { apiKey, apiToken } from "../resources/apiContext";
import { setToken } from "../resources/token";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";

const LoginButton = () => {
  const currentUrl = window.location.href;
  return (
    <a
      className="confirmButton"
      href={`https://trello.com/1/authorize?expiration=1day&name=Trullo&scope=read,write&response_type=token&key=${apiKey}&return_url=${currentUrl}`}
    >
      Login with your Trello account
    </a>
  );
};

const LoginDemo = () => {
  setToken(apiToken);
};

const LoginUser = (value) => {
  setToken(value);
};

function getTokenFromHash() {
  const hash = window.location.hash;
  if (hash.length > 0) {
    const token = hash.slice(7); //slice the "#token=" from the start of the string
    return token;
  } else {
    return "";
  }
}

function getCurrentUrl() {
  const url = window.location.href;
  const hashIndex = url.indexOf("#");
  return url.slice(0, hashIndex);
}

export const LoginScreen = ({ isLoggedIn, setIsLoggedIn }) => {
  useEffect(() => {
    const currentToken = getTokenFromHash();
    if (currentToken !== "") {
      const currentUrl = getCurrentUrl();
      LoginUser(currentToken);
      setIsLoggedIn(true);
      window.history.replaceState(null, "", currentUrl);
    }
  }, [setIsLoggedIn]);

  if (isLoggedIn) {
    return <Redirect to="/boards" />;
  }

  return (
    <div className="loginWindow">
      <div className="messageWindow">
        <LoginButton />
        <p>or use the demo account by clicking below</p>
        <button
          className="cancelButton"
          onClick={() => {
            LoginDemo();
            setIsLoggedIn(true);
          }}
        >
          Demo Login
        </button>
      </div>
    </div>
  );
};
