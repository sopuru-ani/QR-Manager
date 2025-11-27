import React, { useState, useEffect } from "react";
import {
  FiExternalLink,
  FiEdit,
  FiTrash2,
  FiClock,
  FiLink,
} from "react-icons/fi";

import { useMainContext } from "../useMainContext.jsx";
// import { use } from "react";
import QRDetailModal from "./QRDetailModal.jsx";
import DeleteQrCode from "./DeleteQrCode.jsx";
import Loading from "./Loading.jsx";

function QrList() {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [loading, setLoading] = useState(true);

  const { expressRoute } = useMainContext();
  const [fetchedData, setFetchedData] = useState([]);
  useEffect(() => {
    // document.title = "QR Codes - QR Code Generator";
    async function fetchData() {
      const response = await fetch(`${expressRoute}api/qrcode`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setFetchedData(data.qrCodes);
        setLoading(false);
      }
      if (response.status === 401) {
        console.log("Unauthorized");
      }
      if (!response.ok) {
        console.log(data.msg || "Failed to fetch QR Codes. Please try again.");
      }
    }
    fetchData();
    setRerender(false);
  }, [rerender]);
  //   useEffect(() => {
  //     console.log(fetchedData);
  //   }, [fetchedData]);

  return (
    <>
      <title>QR codes</title>
      {/* Content Grid */}

      {loading ? (
        <Loading text="loading QR codes..." />
      ) : (
        <main
          className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 mb-2 h-[calc(100dvh-88px)] overflow-y-auto scrollbar-thin scrollbar-thumb-lime scrollbar-track-gray-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full hover:scrollbar-thumb-lime-dark"
          style={{ gridAutoRows: "min-content" }}
        >
          {/* Placeholder QR Code Cards */}
          {fetchedData.map((i) => (
            <div
              key={i._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center gap-3 h-fit"
            >
              {/* QR Preview Placeholder */}
              {/* <div className="w-32 h-32 bg-gray-light rounded-md flex items-center justify-center text-gray-dark text-sm">
              QR PREVIEW
            </div> */}
              <img
                src={i.qrDataUrl}
                alt={`QR Code for ${i.title}`}
                className="w-32 h-32"
              />

              {/* Title */}
              <p className="text-gray-dark font-semibold text-lg text-center">
                <span className="truncate block w-[180px]">{i.title}</span>
              </p>

              {/* Destination URL */}
              <div className="flex items-center gap-2 text-gray text-sm">
                <FiLink className="text-gray-dark" />
                <span className="truncate max-w-[180px]">{`${expressRoute}redirect/${i._id}`}</span>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-2 text-gray-dark text-xs">
                <FiClock />
                <span>Last updated: {i.dateCreated}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-2">
                {/* View Button */}
                <button
                  className="flex items-center gap-1 bg-gray-light text-gray-dark py-1 px-3 rounded-md hover:bg-gray transition text-sm"
                  onClick={() => {
                    setSelectedQR(
                      fetchedData.find((qr) => qr._id === i._id) || null
                    );
                    setModalOpen(true);
                  }}
                >
                  <FiExternalLink />
                  View
                </button>

                {/* Edit Button */}
                <button
                  className="flex items-center gap-1 bg-lime text-white py-1 px-3 rounded-md hover:bg-lime-dark transition text-sm"
                  onClick={() => {
                    setEditMode(true);
                    setSelectedQR(
                      fetchedData.find((qr) => qr._id === i._id) || null
                    );
                    setModalOpen(true);
                  }}
                >
                  <FiEdit />
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  className="flex items-center gap-1 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition text-sm"
                  onClick={() => {
                    setDeleteTarget(
                      fetchedData.find((qr) => qr._id === i._id) || null
                    );
                    setDeleteConfirmOpen(true);
                  }}
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {/* <button
          onClick={() => {
            setSelectedQR(fetchedData);
            setModalOpen(true);
          }}
          className="bg-lime text-white py-2 px-4 rounded-md"
        >
          Open QR Details
        </button> */}
          <QRDetailModal
            render={rerender}
            rerender={setRerender}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            qr={selectedQR}
            editMode={editMode}
            setEditMode={setEditMode}
          />
          <DeleteQrCode
            render={rerender}
            rerender={setRerender}
            open={deleteConfirmOpen}
            qr={deleteTarget}
            onClose={() => setDeleteConfirmOpen(false)}
          />
        </main>
      )}
    </>
  );
}

export default QrList;
