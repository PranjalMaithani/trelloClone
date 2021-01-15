import { Link } from "react-router-dom";

export const ErrorWindow = ({ message, callback }) => {
  return (
    <div className="boardsSelectionWrapper">
      <div className="messageWindow ">
        <p className="cardText messageWindowText">{message}</p>
        <Link
          to="/"
          className="confirmButton"
          onClick={() => {
            callback && callback();
          }}
        >
          Back
        </Link>
      </div>
    </div>
  );
};
