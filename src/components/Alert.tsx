import React from "react";
interface AlertProps extends CloseAlert {
  alert: string;
}

export type CloseAlert = {
  closeAlert: () => void;
};

const Alert = ({ alert, closeAlert }: AlertProps) => {
  return (
    <div className={`alert ${alert ? "d-block" : "d-none"} `}>
      <span>{alert}</span>
      <span onClick={closeAlert}>X</span>
    </div>
  );
};

export default Alert;
