import React from "react";
interface AlertProps extends CloseAlert {
  alert: string;
}

export type CloseAlert = {
  closeAlert: () => void;
};

const Alert = ({ alert, closeAlert }: AlertProps) => {
  return (
    <div className={`alert alert-success ${alert ? "d-flex" : "d-none"} `}>
      <span style={{marginRight: '0.8rem'}}>{alert}</span>
      <span onClick={closeAlert}>X</span>
    </div>
  );
};

export default Alert;
