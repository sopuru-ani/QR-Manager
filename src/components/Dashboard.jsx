import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiLink, FiBarChart2, FiActivity } from "react-icons/fi";
import { MdDownload } from "react-icons/md";

import { useMainContext } from "../useMainContext";
import Loading from "./Loading.jsx";
import QRDetailModal from "./QRDetailModal.jsx";
import DeleteQrCode from "./DeleteQrCode.jsx";
import ScanActivity from "./ScanActivity.jsx";
import EmptyQRState from "./EmptyQRState.jsx";

function Dashboard() {
  const { expressRoute } = useMainContext();
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fetchedData, setFetchedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      const response = await fetch(`${expressRoute}api/overview`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setFetchedData(data);
        setLoading(false);
      }
      if (response.status === 401) {
        navigate("/login");
        //
      }
      if (!response.ok) {
        console.log(
          data.msg || "Failed to fetch overview data. Please try again."
        );
        setLoading(false);
        // navigate("/login");
      }
    }
    fetchDashboardData();
    setRerender(false);
  }, [rerender]);

  return (
    <>
      <title>Overview</title>
      {loading ? (
        <Loading text="loading overview..." />
      ) : !fetchedData.recentQrCodes || fetchedData.recentQrCodes === 0 ? (
        <EmptyQRState />
      ) : (
        <div className="mt-2 mb p-6 h-[calc(100dvh-88px)] overflow-y-auto scrollbar-thin scrollbar-thumb-lime scrollbar-track-gray-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full hover:scrollbar-thumb-lime-dark">
          {/* Top stats cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <FiBarChart2 size={24} className="text-lime" />
                <span className="text-gray-dark text-sm">Total QR Codes</span>
              </div>
              <h2 className="text-2xl font-bold mt-4 text-gray-dark">
                {fetchedData.totalQRCodes}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <FiActivity size={24} className="text-lime" />
                <span className="text-gray-dark text-sm">Total Scans</span>
              </div>
              <h2 className="text-2xl font-bold mt-4 text-gray-dark">
                {fetchedData.totalScans}
              </h2>
            </div>

            {/* <div className="bg-white rounded-xl shadow p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <FiClock size={24} className="text-lime" />
                <span className="text-gray-dark text-sm">Recent Activity</span>
              </div>
              <h2 className="text-2xl font-bold mt-4 text-gray-dark">0</h2>
            </div> */}
          </section>

          {/* Middle charts section */}
          <section className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
            {/* Scan Activity chart placeholder */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col">
              {/* <h3 className="font-semibold text-gray-dark mb-3">
                Scan Activity
              </h3> */}
              <ScanActivity data={fetchedData.scans} />
              <div className="flex-1 bg-gray-100 rounded" />
            </div>

            {/* QR Performance chart placeholder */}
            {/* <div className="bg-white rounded-xl shadow p-5 flex flex-col">
              <h3 className="font-semibold text-gray-dark mb-3">
                QR Performance
              </h3>
              <div className="flex-1 bg-gray-100 rounded" />
            </div> */}
          </section>

          {/* Recent QR codes / activity list */}
          <section className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-gray-dark mb-4">
              Recent QR Codes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fetchedData.recentQrCodes.map((i) => (
                <div
                  key={i._id}
                  className="relative bg-gray-100 rounded-lg p-4 flex flex-col items-center gap-3"
                >
                  <a
                    className="absolute top-4 left-4 flex items-center gap-2 p-2 bg-gray-300 hover:bg-gray-400 text-white rounded"
                    download={`${i.title}.png`}
                    href={i.qrDataUrl}
                  >
                    <MdDownload size={20} />
                  </a>
                  <img
                    src={i.qrDataUrl}
                    alt={`QR Code for ${i.title}`}
                    className="w-32 h-32"
                  />
                  <p className="text-gray-dark font-medium text-center">
                    {i.title}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="bg-lime text-white py-1 px-3 rounded hover:bg-lime-dark text-sm"
                      onClick={() => {
                        setSelectedQR(
                          fetchedData.recentQrCodes.find(
                            (qr) => qr._id === i._id
                          ) || null
                        );
                        setModalOpen(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="bg-gray-dark text-white py-1 px-3 rounded hover:bg-gray-600 text-sm"
                      onClick={() => {
                        setEditMode(true);
                        setSelectedQR(
                          fetchedData.recentQrCodes.find(
                            (qr) => qr._id === i._id
                          ) || null
                        );
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
                      onClick={() => {
                        setDeleteTarget(
                          fetchedData.recentQrCodes.find(
                            (qr) => qr._id === i._id
                          ) || null
                        );
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
          </section>
        </div>
      )}
    </>
  );
}

export default Dashboard;
