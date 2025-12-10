import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiExternalLink,
  FiEdit,
  FiTrash2,
  FiClock,
  FiLink,
  FiX,
} from "react-icons/fi";
import { MdDownload } from "react-icons/md";

import { useMainContext } from "../useMainContext.jsx";
// import { use } from "react";
import QRDetailModal from "./QRDetailModal.jsx";
import DeleteQrCode from "./DeleteQrCode.jsx";
import Loading from "./Loading.jsx";
import EmptyQRState from "./EmptyQRState.jsx";
import SortDropdown from "./SortDropdown.jsx";

function QrList() {
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [loading, setLoading] = useState(true);

  //for the filter and sort thingy
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  const { expressRoute } = useMainContext();
  const [fetchedData, setFetchedData] = useState([]);
  // const [displayData, setDisplayData] = useState([]);
  // let displayData = [];
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
        navigate("/login");
      }
      if (!response.ok) {
        setFetchedData(data);

        setLoading(false);
      }
    }
    fetchData();
    setRerender(false);
    // displayData = [...fetchedData];
    //

    // if (search.trim()) {
    //   displayData = displayData.filter((qr) =>
    //     qr.title.toLowerCase().includes(search.toLowerCase())
    //   );
    // }

    // if (sort === "newest") {
    //   displayData.sort(
    //     (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
    //   );
    // } else if (sort === "oldest") {
    //   displayData.sort(
    //     (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
    //   );
    // } else if (sort === "clicks") {
    //   displayData.sort((a, b) => b.clicks - a.clicks);
    // }
  }, [rerender]);
  const displayData = Array.isArray(fetchedData)
    ? fetchedData
        .filter((qr) => qr.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
          if (sort === "newest")
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          if (sort === "oldest")
            return new Date(a.dateCreated) - new Date(b.dateCreated);
          if (sort === "clicks") return b.clicks - a.clicks;
          return 0;
        })
    : [];
  //   useEffect(() => {
  //
  //   }, [fetchedData]);

  return (
    <>
      <title>QR codes</title>
      {/* Content Grid */}

      {loading ? (
        <Loading text="loading QR codes..." />
      ) : fetchedData.length === 0 ||
        fetchedData.msg === "No QR codes found" ? (
        <EmptyQRState />
      ) : (
        <>
          <main
            className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 mb-2 h-[calc(100dvh-88px)] overflow-y-auto scrollbar-thin scrollbar-thumb-lime scrollbar-track-gray-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full hover:scrollbar-thumb-lime-dark"
            style={{ gridAutoRows: "min-content" }}
          >
            <div className="bg-amber-50 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-between gap-3 sticky -top-8 z-1 -mx-6 -mb-6 -mt-8 p-6">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search QR codes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none bg-white focus:border-lime focus:ring-1 focus:ring-lime/40"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>

              {/* Sort */}

              {/* <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="clicks">Most Scans</option>
              </select> */}
              <SortDropdown
                options={[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "clicks", label: "Most Scans" },
                ]}
                selected={sort}
                onChange={(val) => setSort(val)}
              />
            </div>
            {/* Placeholder QR Code Cards */}
            {displayData.map((i) => (
              <div
                key={i._id}
                className="relative bg-white rounded-lg shadow-md p-4 flex flex-col items-center gap-3 h-fit"
              >
                <a
                  className="absolute top-4 left-4 flex items-center gap-2 p-2 bg-gray-300 hover:bg-gray-400 text-white rounded"
                  download={`${i.title}.png`}
                  href={i.qrDataUrl}
                >
                  <MdDownload size={20} />
                </a>
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
                  <span className="truncate max-w-[180px]">{`https://qr-manager.net/redirect/${i._id}`}</span>
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
        </>
      )}
    </>
  );
}

export default QrList;
