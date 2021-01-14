import { Link } from "react-router-dom";

export const Footer = ({ logOutResetData, isLoggedIn }) => {
  return (
    <div className="App-footer">
      <p style={{ color: "white", textShadow: "1px 1px 2px black" }}>
        <b>CAREFUL</b> : This trello clone works on your actual trello account
        data. Changes will be saved.
      </p>
      <div
        style={{
          minWidth: "20%", //retain elements position even if logout button is absent
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {isLoggedIn && (
          <Link to="/">
            <button
              onClick={logOutResetData}
              className="cancelButton fadeIn"
              style={{ margin: "auto 15px" }}
            >
              Log Out
            </button>
          </Link>
        )}
        <a
          href="https://github.com/PranjalMaithani/trelloClone"
          target="_blank"
          rel="noreferrer"
          style={{ color: "lightblue" }}
        >
          Github repo
        </a>
      </div>
    </div>
  );
};
