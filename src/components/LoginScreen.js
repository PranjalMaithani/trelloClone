import { apiKey, apiToken } from "../resources/apiContext";
import { setToken } from "../resources/token";
import { useEffect } from "react";

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
    const token = hash.slice(7); //slice the "#token" from the start of the string
    return token;
  } else {
    return "";
  }
}

export const LoginScreen = ({ isLoggedIn, setIsLoggedIn }) => {
  useEffect(() => {
    const currentToken = getTokenFromHash();
    if (currentToken !== "") {
      LoginUser(currentToken);
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  if (isLoggedIn) {
    return null;
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
