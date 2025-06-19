import React from "react";

/**
 * ButtonPrimary: Responsive button supporting full-width on mobile, custom styles, and proper accessibility.
 */
// PUBLIC_INTERFACE
function ButtonPrimary({ children, onClick, type = "button", className = "", fullWidth, style = {}, ...props }) {
  // If fullWidth is truthy, enforce responsive width class
  const widthClass =
    fullWidth || (className && /\bw-full\b/.test(className)) ? "w-full " : "";

  return (
    <button
      type={type}
      className={
        "td-btn btn px-6 py-2 rounded bg-td-accent text-td-btn font-medium shadow-sm transition-all duration-200 hover:bg-td-accent-dark hover:shadow-md focus:outline-none focus:ring focus:ring-td-accent/30 "
        + widthClass
        + className
      }
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;
