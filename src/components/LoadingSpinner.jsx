import React from "react";

function LoadingSpinner({ value }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>{value}</span>
    </div>

    // <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></div>
  );
}

export default LoadingSpinner;
