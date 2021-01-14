import { Link } from "react-router-dom";

export const ErrorWindow = ({ message }) => {
  return (
    <div className="messageWindow">
      <p className="cardText quietText">{message}</p>
      <Link to="/" className="confirmButton">
        Back
      </Link>
    </div>
  );
};
