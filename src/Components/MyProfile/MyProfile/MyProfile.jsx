import { useState, useContext, useRef, useEffect, useCallback } from "react";
import {
  FaCamera, FaExpand, FaPhotoVideo, FaEdit, FaSave, FaTimes,
  FaUserShield, FaCheck, FaTimesCircle,
} from "react-icons/fa";
import { FiUser, FiMail, FiShield, FiChevronRight } from "react-icons/fi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../Provider/AuthProvider/AuthProvider";
import { imageUpload } from "../../Hooks/imageHooks";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";

/* ─── design tokens ──────────────────────────────────────── */
const BRAND = "#E8170F";
const BRAND_SOFT = "#FFF1F1";
const BRAND_MUTED = "#FFDCDC";

/* ─── tiny helpers ───────────────────────────────────────── */
const RoleBadge = ({ label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: BRAND,
      background: BRAND_SOFT,
      border: `1px solid ${BRAND_MUTED}`,
      padding: "3px 10px",
      borderRadius: 20,
    }}
  >
    <FiShield size={10} />
    {label}
  </span>
);

const Field = ({ icon: Icon, label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <span
      style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.07em",
        textTransform: "uppercase", color: "#9CA3AF"
      }}
    >
      {label}
    </span>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon size={14} color={BRAND} />
      <span style={{ fontSize: 15, color: "#1F2937", fontWeight: 500 }}>
        {value || "—"}
      </span>
    </div>
  </div>
);

const Spinner = ({ size = 18, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "spin .7s linear infinite" }}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeOpacity=".25" />
    <path d="M4 12a8 8 0 018-8" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </svg>
);

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
const MyProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({ name: "", photoURL: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameAvailable, setNameAvailable] = useState(true);
  const [checkingName, setCheckingName] = useState(false);
  const [initialName, setInitialName] = useState("");

  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();

  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();

  const roleLabel = isAdmin ? "Admin" : isModerator ? "Moderator" : isOwner ? "Owner" : "Member";

  /* ── name availability ─── */
  const checkNameAvailability = useCallback(async (name) => {
    if (name.length < 3) { setNameAvailable(false); return; }
    if (name === initialName) { setNameAvailable(true); return; }
    setCheckingName(true);
    try {
      const res = await axiosSecure.get(`/users/check-name?name=${encodeURIComponent(name)}`);
      setNameAvailable(!res.data.exists);
    } catch {
      setNameAvailable(false);
    } finally {
      setCheckingName(false);
    }
  }, [axiosSecure, initialName]);

  /* ── load user ─── */
  useEffect(() => {
    if (id) {
      axiosSecure.get(`/users/${id}`)
        .then((res) => {
          const d = res.data.profileData || res.data;
          setProfileData({ name: d.name || "", photoURL: d.photo || "" });
          setInitialName(d.name || "");
          setPreviewImage(d.photo || "");
        })
        .catch(() => toast.error("Failed to load user data"));
    } else if (user) {
      setProfileData({ name: user.displayName || "", photoURL: user.photoURL || "" });
      setInitialName(user.displayName || "");
      setPreviewImage(user.photoURL || "");
    }
  }, [id, user, axiosSecure]);

  /* ── image handlers ─── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match("image.*")) { toast.error("Select a valid image (JPEG, PNG)"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((p) => ({ ...p, [name]: value }));
    if (name === "name") checkNameAvailability(value);
  };

  /* ── submit ─── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      if (profileData.name.length < 3) throw new Error("Name must be at least 3 characters");
      if (!nameAvailable) throw new Error("Username already taken");

      let imageUrl = profileData.photoURL;
      if (selectedFile) {
        const data = await imageUpload(selectedFile);
        imageUrl = data?.data?.display_url || imageUrl;
      }

      await updateUserProfile({ displayName: profileData.name, photoURL: imageUrl });
      const res = await axiosSecure.put(`/users/${user.email}`, {
        name: profileData.name, photo: imageUrl, email: user.email,
      });
      if (!res.data.success) throw new Error(res.data.message || "Update failed");

      setProfileData({ name: profileData.name, photoURL: imageUrl });
      setPreviewImage(imageUrl);
      setInitialName(profileData.name);
      setSelectedFile(null);
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  /* ─────────────────────────── RENDER ─────────────────────── */
  return (
    <>
      {/* ── global base styles ── */}
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,sans-serif}
        .pf-input{
          width:100%;padding:11px 14px 11px 40px;
          border:1.5px solid #E5E7EB;border-radius:10px;
          font-size:14px;color:#111827;background:#fff;
          transition:border-color .18s,box-shadow .18s;outline:none;
        }
        .pf-input:focus{border-color:${BRAND};box-shadow:0 0 0 3px ${BRAND}22}
        .pf-input:read-only{background:#F9FAFB;cursor:not-allowed;color:#6B7280}
        .pf-btn-primary{
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          padding:11px 22px;border:none;border-radius:10px;cursor:pointer;
          font-size:14px;font-weight:600;letter-spacing:.01em;
          background:${BRAND};color:#fff;
          transition:background .18s,transform .12s,box-shadow .18s;
        }
        .pf-btn-primary:hover:not(:disabled){background:#C40F08;box-shadow:0 4px 14px ${BRAND}40}
        .pf-btn-primary:active:not(:disabled){transform:scale(.98)}
        .pf-btn-primary:disabled{opacity:.6;cursor:not-allowed}
        .pf-btn-ghost{
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          padding:11px 22px;border:1.5px solid #E5E7EB;border-radius:10px;
          cursor:pointer;font-size:14px;font-weight:500;
          background:#fff;color:#374151;
          transition:background .15s,border-color .15s;
        }
        .pf-btn-ghost:hover{background:#F3F4F6;border-color:#D1D5DB}
        @media(max-width:768px){
          .pf-card{flex-direction:column!important}
          .pf-sidebar{width:100%!important;border-right:none!important;border-bottom:1.5px solid #F3F4F6!important;padding-bottom:28px!important}
          .pf-body{width:100%!important;padding:28px 20px!important}
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff8f8 0%,#f9fafb 60%,#fff 100%)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "48px 16px",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pf-card"
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 2px 4px #0000000a, 0 12px 40px #0000000d",
            maxWidth: 900, width: "100%",
            display: "flex",
            border: "1.5px solid #F3F4F6",
            overflow: "hidden",
          }}
        >

          {/* ══ SIDEBAR ══ */}
          <div
            className="pf-sidebar"
            style={{
              width: 280, flexShrink: 0,
              borderRight: "1.5px solid #F3F4F6",
              padding: "40px 28px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
              background: "#FAFAFA",
            }}
          >
            {/* avatar */}
            <div style={{ position: "relative" }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                style={{
                  width: 110, height: 110,
                  borderRadius: "50%",
                  border: `3px solid ${BRAND}`,
                  padding: 3, cursor: "pointer",
                  boxShadow: `0 0 0 6px ${BRAND}18`,
                }}
                onClick={() => setShowImageModal(true)}
              >
                <img
                  src={previewImage || "https://i.ibb.co/PGwHS087/profile-Imagw.jpg"}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              </motion.div>

              {/* upload button */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => { setCameraMode(false); fileInputRef.current.click(); }}
                style={{
                  position: "absolute", bottom: 4, right: 4,
                  width: 30, height: 30, borderRadius: "50%",
                  background: BRAND, border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 2px 8px #0003",
                }}
                title="Change photo"
              >
                <FaCamera size={12} color="#fff" />
              </motion.button>

              <input
                type="file" accept="image/*" ref={fileInputRef}
                onChange={handleImageChange} style={{ display: "none" }}
                capture={cameraMode ? "environment" : undefined}
              />
            </div>

            {/* name */}
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>
                {profileData.name || "Your Name"}
              </h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{user?.email}</p>
              <div style={{ marginTop: 10 }}>
                <RoleBadge label={roleLabel} />
              </div>
            </div>

            {/* stat pills */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 10, width: "100%", marginTop: 4,
            }}>
              {[
                { label: "Role", value: roleLabel },
                { label: "Status", value: "Active" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "#fff", borderRadius: 12,
                  border: "1.5px solid #F3F4F6", padding: "10px 12px", textAlign: "center",
                }}>
                  <p style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>{s.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 3 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* edit toggle */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsEditing((v) => !v)}
              className="pf-btn-primary"
              style={{ width: "100%", marginTop: 6 }}
            >
              {isEditing ? <><FaTimes size={13} /> Cancel</> : <><FaEdit size={13} /> Edit profile</>}
            </motion.button>

            {/* view full photo */}
            {previewImage && (
              <button
                onClick={() => setShowImageModal(true)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, color: "#9CA3AF",
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                <FaExpand size={11} /> View full photo
              </button>
            )}
          </div>

          {/* ══ MAIN BODY ══ */}
          <div
            className="pf-body"
            style={{ flex: 1, padding: "40px 36px", minWidth: 0 }}
          >
            <AnimatePresence mode="wait">

              {/* ── EDIT FORM ── */}
              {isEditing && (
                <motion.form
                  key="edit"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  onSubmit={handleUpdate}
                  style={{ display: "flex", flexDirection: "column", gap: 28 }}
                >
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Edit profile</h2>
                    <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Update your name or photo.</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    {/* Name field */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Full name
                      </label>
                      <div style={{ position: "relative" }}>
                        <FiUser size={15} color="#9CA3AF" style={{
                          position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)"
                        }} />
                        <input
                          className="pf-input"
                          type="text" name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          required minLength={3}
                          placeholder="Enter your name"
                        />
                        {profileData.name.length > 0 && (
                          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                            {checkingName
                              ? <Spinner size={15} color="#9CA3AF" />
                              : nameAvailable
                                ? <FaCheck size={13} color="#22C55E" />
                                : <FaTimesCircle size={13} color={BRAND} />}
                          </span>
                        )}
                      </div>
                      {profileData.name.length > 0 && !checkingName && !nameAvailable && (
                        <span style={{ fontSize: 12, color: BRAND }}>Username already taken</span>
                      )}
                    </div>

                    {/* Email field */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Email
                      </label>
                      <div style={{ position: "relative" }}>
                        <FiMail size={15} color="#9CA3AF" style={{
                          position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)"
                        }} />
                        <input
                          className="pf-input"
                          type="email" value={user?.email || ""} readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* photo upload row */}
                  {selectedFile && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      style={{
                        background: BRAND_SOFT, border: `1px solid ${BRAND_MUTED}`,
                        borderRadius: 10, padding: "12px 16px",
                        display: "flex", alignItems: "center", gap: 12,
                      }}
                    >
                      <img
                        src={previewImage} alt="preview"
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {selectedFile.name}
                        </p>
                        <p style={{ fontSize: 12, color: "#6B7280" }}>
                          {(selectedFile.size / 1024).toFixed(0)} KB — ready to upload
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setPreviewImage(profileData.photoURL); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}
                      >
                        <FaTimes />
                      </button>
                    </motion.div>
                  )}

                  {/* actions */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="submit"
                      className="pf-btn-primary"
                      disabled={isUpdating || !nameAvailable}
                      style={{ flex: 1 }}
                    >
                      {isUpdating ? <><Spinner size={15} /> Saving…</> : <><FaSave size={13} /> Save changes</>}
                    </button>
                    <button
                      type="button"
                      className="pf-btn-ghost"
                      onClick={() => setIsEditing(false)}
                      disabled={isUpdating}
                      style={{ flex: 1 }}
                    >
                      <FaTimes size={13} /> Cancel
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── VIEW MODE ── */}
              {!isEditing && (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  style={{ display: "flex", flexDirection: "column", gap: 28 }}
                >
                  {/* welcome banner */}
                  <div style={{
                    background: `linear-gradient(135deg,${BRAND}12 0%,${BRAND}05 100%)`,
                    border: `1.5px solid ${BRAND}22`,
                    borderRadius: 14, padding: "20px 22px",
                    display: "flex", alignItems: "center", gap: 16,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: BRAND, display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <FaUserShield size={20} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                        Welcome back, {profileData.name || user?.displayName || "there"}!
                      </h3>
                      <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                        You're signed in as <strong style={{ color: BRAND }}>{roleLabel}</strong>
                      </p>
                    </div>
                  </div>

                  {/* personal details card */}
                  <div style={{
                    border: "1.5px solid #F3F4F6", borderRadius: 14, overflow: "hidden",
                  }}>
                    <div style={{
                      padding: "14px 20px", background: "#FAFAFA",
                      borderBottom: "1.5px solid #F3F4F6",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <FiUser size={14} color={BRAND} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: "0.03em" }}>
                        Personal details
                      </span>
                    </div>
                    <div style={{
                      padding: "20px",
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
                    }}>
                      <Field icon={FiUser} label="Full name" value={profileData.name} />
                      <Field icon={FiMail} label="Email" value={user?.email} />
                      <Field icon={FiShield} label="Role" value={roleLabel} />
                      <Field icon={FiShield} label="Account status" value="Active" />
                    </div>
                  </div>

                  {/* quick action row */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsEditing(true)}
                      className="pf-btn-primary"
                      style={{ flex: 1 }}
                    >
                      <FaEdit size={13} /> Edit profile
                      <FiChevronRight size={14} style={{ marginLeft: "auto" }} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ══ IMAGE MODAL ══ */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)",
              zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: "relative", maxWidth: 480, width: "100%" }}
            >
              <img
                src={previewImage}
                alt="Full preview"
                style={{ width: "100%", borderRadius: 16, objectFit: "cover", display: "block" }}
              />
              <button
                onClick={() => setShowImageModal(false)}
                style={{
                  position: "absolute", top: -14, right: -14,
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#fff", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 10px #0003",
                }}
              >
                <FaTimes size={14} color="#374151" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyProfile;