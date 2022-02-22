import React from "react";
interface AlertProps {
  alert: IAlert;
  closeAlert: () => void;
}

interface IAlert {
  text: string;
  type: string;
}

const Alert = ({ alert, closeAlert }: AlertProps) => {
  return (
    <div
      className={`alert ${
        alert.type === "success" ? "alert-success" : "alert-danger"
      } ${alert.text ? "d-flex" : "d-none"} `}
    >
      <span style={{ marginRight: "0.8rem" }}>{alert.text}</span>
      <button
        className="bg-transparent text-inherit pointer"
        onClick={closeAlert}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path
            fill="currentColor"
            d="M256 292.777L364.197 400.974C364.978 401.756 366.244 401.756 367.025 400.974L400.975 367.025C401.756 366.244 401.756 364.978 400.975 364.197L292.777 256L400.975 147.803C401.756 147.022 401.756 145.756 400.975 144.975L367.025 111.025C366.244 110.244 364.978 110.244 364.197 111.025L256 219.223L147.803 111.025C147.022 110.244 145.756 110.244 144.975 111.025L111.025 144.975C110.244 145.756 110.244 147.022 111.025 147.803L219.223 256L111.025 364.197C110.244 364.978 110.244 366.244 111.025 367.025L144.975 400.974C145.756 401.756 147.022 401.756 147.803 400.974L256 292.777Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
