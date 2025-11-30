import { useRef } from "react";

export default function OTPInput({ length = 6, value, onChange }) {
  const inputsRef = useRef([]);

  const handleInput = (e, idx) => {
    const inputVal = e.target.value.replace(/\D/g, "");

    if (!inputVal) {
      // empty state
      const newVal = value.split("");
      newVal[idx] = "";
      onChange(newVal.join(""));
      return;
    }

    const newVal = value.split("");

    // typing or overwrite
    newVal[idx] = inputVal[0];
    onChange(newVal.join(""));

    // move to next if exists
    if (idx < length - 1) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const newVal = value.split("");

      // if input already empty -> move focus back
      if (!value[idx] && idx > 0) {
        newVal[idx - 1] = "";
        onChange(newVal.join(""));
        inputsRef.current[idx - 1].focus();
        return;
      }

      // otherwise just clear current digit
      newVal[idx] = "";
      onChange(newVal.join(""));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteVal = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasteVal) return;

    const newVal = value.split("");

    for (let i = 0; i < length && i < pasteVal.length; i++) {
      newVal[i] = pasteVal[i];
    }

    onChange(newVal.join(""));

    // move focus to last entered cell
    const idx = Math.min(pasteVal.length - 1, length - 1);
    inputsRef.current[idx].focus();
  };

  return (
    <div className="flex justify-around sm:justify-between gap-1">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          value={value[idx] || ""}
          onChange={(e) => handleInput(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode="numeric"
          className="w-9 h-9 sm:w-12 sm:h-12 border border-gray rounded-lg text-center text-x1 font-bold focus:outline-none focus:ring-1 focus:ring-lime"
        />
      ))}
    </div>
  );
}
