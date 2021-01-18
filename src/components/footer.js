import { Link, useRouteMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkForScrollbar, useResize } from "../utils/lib";

export const Footer = ({ logOutResetData, isLoggedIn, overflowRef }) => {
  const [paddingBottom, setPaddingBottom] = useState(0);
  const match = useRouteMatch("/:current");

  let windowWidth = useResize(1000);

  useEffect(() => {
    if (overflowRef.current !== null) {
      console.log("checking");
      checkForScrollbar(
        overflowRef.current,
        () => {
          setPaddingBottom(15);
        },
        () => {
          setPaddingBottom(0);
        }
      );
    } else {
      setPaddingBottom(0);
    }
  }, [overflowRef, match, windowWidth]);

  return (
    <div className="App-footer" style={{ paddingBottom: paddingBottom }}>
      <p style={{ color: "white", textShadow: "1px 1px 2px black" }}>
        <b>CAREFUL</b> : This trello clone works on your actual trello account
        data. Changes will be saved.
      </p>
      <div
        className="footerButtons"
        style={{
          minWidth: "20%", //retain elements position even if logout button is absent
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
