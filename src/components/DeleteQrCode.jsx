import React from "react";
import { useMainContext } from "../useMainContext";
function DeleteQrCode({ render, rerender, open, qr, onClose }) {
  if (!open || !qr) return null;
  const { expressRoute } = useMainContext();
  async function handleDelete(id) {
    const response = await fetch(`${expressRoute}api/qrcode/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    if (response.status === 401) {
      console.log(data.msg || "unauthorized entry");
    }
    if (response.ok) {
      console.log(data.msg || "successfully deleted");
    }
    if (!response.ok) {
      console.log(data.msg || "Server error. please try again");
    }

    // refresh the list
    rerender(true);

    setTimeout(() => {
      onClose();
    }, 2000);
  }

  return (
    <div className="fixed inset-0 bg-gray/50 backdrop-blur-xs backdrop-brightness-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md p-6 w-[90%] max-w-sm">
        <h3 className="text-lg font-bold mb-2">Delete QR?</h3>

        <p className="text-sm mb-4">
          Are you sure you want to delete <strong>{qr.title}</strong>? This
          cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => handleDelete(qr._id)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteQrCode;
