import React from "react";
interface ErrorProps extends CloseAlert {
  error: string;
}

type CloseAlert = {
  closeAlert: () => void;
};

const Error = ({ error, closeAlert }: ErrorProps) => {
  return (
    <div className={`alert ${error ? "d-block" : "d-none"} `}>
      <span>{error}</span>
      <span onClick={closeAlert}>X</span>
    </div>
  );
};

export default Error;
