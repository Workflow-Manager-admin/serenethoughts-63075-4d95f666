import React from "react";

// PUBLIC_INTERFACE
function ButtonPrimary({ children, onClick, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={
        "td-btn btn px-6 py-2 rounded bg-td-accent text-td-btn font-medium shadow-sm transition-all duration-200 hover:bg-td-accent-dark hover:shadow-md focus:outline-none focus:ring focus:ring-td-accent/30 " +
        className
      }
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;
