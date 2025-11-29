import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

function SortDropdown({ options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-48">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex justify-between items-center hover:border-lime focus:ring-1 focus:ring-lime/40"
      >
        {options.find((opt) => opt.value === selected)?.label || "Select"}
        <FiChevronDown
          className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20  overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-lime hover:text-white flex justify-between items-center ${
                selected === opt.value
                  ? "bg-lime text-white font-semibold"
                  : "text-gray-700"
              }`}
            >
              {opt.label}
              {selected === opt.value && <FiCheck />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortDropdown;
