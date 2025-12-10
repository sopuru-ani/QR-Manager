import React, { useState, useEffect } from "react";
import {
  FiExternalLink,
  FiEdit,
  FiTrash2,
  FiClock,
  FiLink,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useMainContext } from "../useMainContext.jsx";

function QRDetailModal({
  open,
  onClose,
  qr,
  render,
  rerender,
  editMode,
  setEditMode,
}) {
  const { expressRoute } = useMainContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", url: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSave(id, data) {
    const response = await fetch(`${expressRoute}api/qrcode/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (response.status === 401) {
      setFormData({ title: qr.title || "", url: qr.url || "" });
      navigate("/login");
    }
    if (response.ok) {
      setFormData({ title: data.title || "", url: data.url || "" });
      // setSuccess(true);

      rerender(true);

      // setTimeout(() => {
      //   onClose();
      // }, 3000);
      // setSuccess(false);
      qr.title = data.title;
      qr.url = data.url;

      setEditMode(false);
    }
    if (!response.ok) {
      setFormData({ title: qr.title || "", url: qr.url || "" });
    }
  }
  async function onDelete(id) {
    const response = await fetch(`${expressRoute}api/qrcode/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const resData = await response.json();
    if (response.status === 401) {
      setFormData({ title: qr.title || "", url: qr.url || "" });
      setSuccess(false);
      navigate("/login");
    }
    if (response.ok) {
      setSuccess(true);
    }
    if (!response.ok) {
      setFormData({ title: qr.title || "", url: qr.url || "" });
      setSuccess(false);
    }
  }
  useEffect(() => {
    if (qr) {
      setFormData({
        title: qr.title || "",
        url: qr.url || "",
      });
      setConfirmDelete(false);
    }
  }, [qr, render]);

  if (!open) return null;

  const handleSave = async () => {
    await onSave(qr._id, formData);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({ title: qr.title || "", url: qr.url || "" });
  };

  const handleDelete = async () => {
    await onDelete(qr._id);
    setConfirmDelete(false);
    setTimeout(() => {
      onClose();
      rerender(true);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-gray/50 backdrop-blur-xs backdrop-brightness-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-auto p-4 sm:p-6 sm:pt-8 sm:pb-8 relative flex flex-col sm:flex-row gap-6">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-dark hover:text-black transition"
          onClick={() => {
            onClose();
            setEditMode(false);
            setConfirmDelete(false);
          }}
        >
          <FiX size={24} />
        </button>

        {/* LEFT: QR Preview */}
        <div className="flex flex-col items-center justify-center sm:w-1/2">
          <div className="w-52 h-52 bg-gray-light rounded-md flex items-center justify-center">
            {qr?.qrDataUrl ? (
              <img
                src={qr.qrDataUrl}
                alt="QR Preview"
                className="w-full h-full"
              />
            ) : (
              <span className="text-gray-dark text-sm">QR PREVIEW</span>
            )}
          </div>
        </div>

        {/* RIGHT: Info + Buttons */}
        <div className="flex flex-col justify-between sm:w-1/2 gap-4 text-gray-dark items-center">
          <div className="flex flex-col gap-3">
            {/* Title */}
            {editMode ? (
              <input
                className="border p-2 rounded w-full text-lg font-semibold"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            ) : (
              <h2 className="text-2xl font-semibold wrap-break-word truncate max-w-55 sm:max-w-65 md:max-w-82">
                {qr?.title || "Untitled QR"}
              </h2>
            )}

            {/* Target URL */}
            <div className="flex items-start gap-2 text-sm w-full">
              <FiLink size={18} className="mt-1" />
              {editMode ? (
                <input
                  className="border p-2 rounded w-full text-sm"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                />
              ) : (
                <span className="wrap-break-word truncate max-w-full">
                  {qr?.url || "https://example.com"}
                </span>
              )}
            </div>

            {/* Short URL */}
            <div className="flex items-start gap-2 text-sm w-full">
              <FiExternalLink size={18} className="mt-1" />
              <span className="wrap-break-word truncate max-w-55 sm:max-w-65 md:max-w-82">
                {`https://qr-manager.net/redirect/${qr?._id}` ||
                  "https://yourapp.com/redirect/id"}
              </span>
            </div>

            {/* Clicks */}
            <div className="flex items-center gap-2 text-sm w-full">
              <FiClock />
              <span>
                Clicks: <strong>{qr?.clicks ?? 0}</strong>
              </span>
            </div>

            {/* Dates */}
            <div className="flex flex-col gap-1 text-xs text-gray-500 w-full">
              <div className="flex gap-2 items-center">
                <FiClock /> Created:{" "}
                {qr?.dateCreated
                  ? new Date(qr.dateCreated).toLocaleString()
                  : "N/A"}
              </div>
              <div className="flex gap-2 items-center">
                <FiClock /> Last modified:{" "}
                {qr?.dateModified
                  ? new Date(qr.dateModified).toLocaleString()
                  : "Never"}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-2">
            {/* Open */}
            {!editMode && !confirmDelete && (
              <button
                className="flex items-center gap-1 bg-gray-light text-gray-dark py-2 px-4 rounded-md hover:bg-gray transition text-sm"
                onClick={() => window.open(qr.url, "_blank")}
              >
                <FiExternalLink /> Open
              </button>
            )}

            {/* Edit / Save */}
            {editMode ? (
              <>
                <button
                  className="flex items-center gap-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition text-sm"
                  onClick={handleSave}
                >
                  <FiCheck /> Save
                </button>
                <button
                  className="flex items-center gap-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition text-sm"
                  onClick={handleCancel}
                >
                  <FiX /> Cancel
                </button>
              </>
            ) : !confirmDelete ? (
              <button
                className="flex items-center gap-1 bg-lime text-white py-2 px-4 rounded-md hover:bg-lime-dark transition text-sm"
                onClick={() => setEditMode(true)}
              >
                <FiEdit /> Edit
              </button>
            ) : null}

            {/* Delete / Confirm Delete */}
            {!editMode && !confirmDelete && (
              <button
                className="flex items-center gap-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition text-sm"
                onClick={() => setConfirmDelete(true)}
              >
                <FiTrash2 /> Delete
              </button>
            )}

            {confirmDelete && (
              <div className="flex flex-col gap-2 w-full items-center sm:items-start">
                <span className="text-red-600 font-medium">
                  Are you sure you want to delete this QR?
                </span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className="flex items-center gap-1 bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition text-sm"
                    onClick={handleDelete}
                  >
                    <FiTrash2 /> Confirm
                  </button>
                  <button
                    className="flex items-center gap-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition text-sm"
                    onClick={() => setConfirmDelete(false)}
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRDetailModal;
