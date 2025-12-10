import React, { useRef, useEffect, useState } from "react";
// import DeleteAccount from "./DeleteAccount.jsx";

function ProfileModal({
  show,
  onClose,
  triggerRef,
  profileData,
  logout,
  setShowDeleteAccount,
  showAddPassword,
  setShowAddPassword,
  showChangePassword,
  setShowChangePassword,
}) {
  const modalRef = useRef(null);
  // const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  //

  useEffect(() => {
    if (!show) return;

    function handlePointerDown(event) {
      const modalEl = modalRef.current;
      const triggerEl = triggerRef?.current;

      // if clicked inside the modal => ignore
      if (modalEl && modalEl.contains(event.target)) return;

      // if clicked the trigger button (or inside it) => ignore
      if (triggerEl && triggerEl.contains(event.target)) return;

      // otherwise -> clicked outside -> close
      onClose();
    }

    // use pointerdown for better touch + mouse handling
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [show, onClose, triggerRef]);
  if (!show) return null;

  return (
    <div className="z-50" onClick={onClose}>
      <div
        ref={modalRef}
        className="absolute right-4 top-20 bg-white w-60 p-6 rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <h2 className="text-xl font-semibold mb-4 text-center">Profile</h2> */}

        <div className="text-center mb-6">
          {profileData?.[0].avatar ? (
            <img
              src={profileData[0].avatar + ""}
              alt="Profile"
              className="mx-auto w-16 h-16 rounded-full object-cover shadow"
            />
          ) : (
            <div
              className="mx-auto w-16 h-16 rounded-full bg-gray-200 
                 flex items-center justify-center font-bold text-2xl"
            >
              {profileData?.[0].firstName?.[0] || "N"}
              {profileData?.[0].lastName?.[0] || "A"}
            </div>
          )}

          <p className="mt-2 text-gray-700">
            Logged in as: {profileData[0].email}
          </p>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3 hover:bg-blue-600"
          onClick={logout}
        >
          Logout
        </button>

        {profileData[0].hashedPassword && profileData[0].googleAuth ? (
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3 hover:bg-blue-600"
            onClick={() => {
              setShowChangePassword(true);
            }}
          >
            Change Password
          </button>
        ) : (
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3 hover:bg-blue-600"
            onClick={() => {
              setShowAddPassword(true);
            }}
          >
            Add Password
          </button>
        )}

        <button
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          onClick={() => {
            setShowDeleteAccount(true);
          }}
        >
          Delete Account
        </button>

        {/* <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
          onClick={onClose}
        >
          ✖
        </button> */}
      </div>
      {/* <DeleteAccount
        open={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
      /> */}
    </div>
  );
}

export default ProfileModal;
