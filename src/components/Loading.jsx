import React from "react";

function Loading({ text }) {
  return (
    <div className="h-[calc(100dvh-88px)] flex flex-col items-center justify-center bg-gray-light px-4">
      <div className="w-12 h-12 border-3 border-lime border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lime font-semibold text-lg">{text}</p>
    </div>
  );
}

export default Loading;
