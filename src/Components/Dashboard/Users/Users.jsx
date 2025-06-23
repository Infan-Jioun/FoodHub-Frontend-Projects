import useAllUserHooks from "../../Hooks/useAllUserHooks";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Input } from "@material-tailwind/react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";

const CountUp = ({ to, from = 0, duration = 2, separator = ",", className = "" }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };
        const formattedNumber = Intl.NumberFormat("en-US", options).format(latest.toFixed(0));
        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });
    motionValue.set(to);
    return () => unsubscribe();
  }, [springValue, to, separator, motionValue]);

  return <span className={className} ref={ref} />;
};

const UserSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border rounded-lg animate-pulse bg-white">
    <div className="w-10 h-10 bg-gray-300 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const Users = () => {
  const [users, isLoading, refetch] = useAllUserHooks();
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const axiosSecure = useAxiosSecure();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const { user: currentUser } = useAuth();
  const USERS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const currentUserInfo = users?.find((u) => u.email === currentUser?.email);
  const currentRole = currentUserInfo?.role;

  const sortedUsers = [...users].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const filteredUsers = sortedUsers.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchInput.toLowerCase());

    const matchTab =
      activeTab === "all" ||
      (activeTab === "admin" && user.role === "admin") ||
      (activeTab === "moderator" && user.role === "moderator") ||
      (activeTab === "owner" && user.role === "owner");

    return matchSearch && matchTab;
  });

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, activeTab]);

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "User will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff0000d8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${userId}`).then(() => {
          refetch();
          toast.success("User deleted successfully.");
        });
      }
    });
  };

  const updateRole = (userId, role) => {
    const allowedByModerator = role === "user" || role === "owner";

    if (currentRole === "admin" || (currentRole === "moderator" && allowedByModerator)) {
      const roleRoute = role === "owner" ? "restaurantOwner" : role;
      axiosSecure.patch(`/users/${roleRoute}/${userId}`).then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          toast.success(`Role updated to ${role}`);
        }
      });
    } else {
      Swal.fire("Access Denied", "You are not allowed to assign this role.", "error");
    }
  };

  const openRoleModal = (user) => {
    if (currentRole === "moderator" && (user.role === "admin" || user.role === "moderator")) {
      return Swal.fire("Access Denied", "You cannot change this user's role.", "error");
    }

    if (currentRole === "admin" || currentRole === "moderator") {
      setSelectedUserId(user._id);
      setSelectedUserRole(user.role);
      document.getElementById("role_modal").showModal();
    } else {
      Swal.fire("Access Denied", "Only admins or moderators can assign roles.", "error");
    }
  };

  return (
    <div className="p-4 font-Kanit">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-[#ff0000d8] flex items-center gap-2">
          Manage Users{" "}
          <CountUp from={0} to={users.length} separator="," duration={2} className="text-4xl" />
        </h2>
        <div className="w-full md:w-60 relative">
          <Input
            type="text"
            className="pl-5 text-[#ff0000d8] font-semibold"
            label="Search Users"
            color="red"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute h-4 w-4 text-[#ff0000d8] top-3 right-4" />
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", "admin", "moderator", "owner"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-[#ff0000d8] text-white shadow-sm"
                : "bg-gray-100 text-[#ff0000d8] hover:bg-[#ffecec]"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="grid gap-4">{[...Array(4)].map((_, i) => <UserSkeleton key={i} />)}</div>
      ) : paginatedUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No users found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedUsers.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-xl bg-white shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={user.photo || "https://i.ibb.co/PGwHS087/profile-Imagw.jpg"}
                    alt="profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#ff0000d8]"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-[#ff0000d8] hover:underline text-lg">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.date && (
                      <p className="text-xs text-gray-400">
                        {new Date(user.date).toLocaleString()}
                      </p>
                    )}
                    {user.address && (
                      <p className="text-xs text-gray-500">{user.address}</p>
                    )}
                    {user.shopMobileNumber && (
                      <a
                        href={`tel:${user.shopMobileNumber}`}
                        className="text-xs text-blue-600 underline"
                      >
                        {user.shopMobileNumber}
                      </a>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    className="btn btn-sm bg-red-100 text-red-500 hover:bg-red-200"
                    onClick={() => handleDelete(user._id)}
                  >
                    <AiOutlineUserDelete size={18} />
                  </button>
                  <button
                    className="btn btn-sm bg-gray-100 text-[#ff0000d8] hover:bg-[#ffecec]"
                    onClick={() => openRoleModal(user)}
                  >
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center mt-6 gap-2">
            <div className="join grid grid-cols-2">
              <button
                className="join-item btn btn-outline bg-[#ff0000d8] hover:bg-[#ff0000d8] text-white"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="join-item btn btn-outline bg-[#ff0000d8] hover:bg-[#ff0000d8] text-white"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </>
      )}

      {/* Role Modal */}
      <dialog id="role_modal" className="modal">
        <div className="modal-box rounded-xl shadow-lg bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4 text-[#ff0000d8]">Change User Role</h3>
          <div className="grid gap-3">
            {["user", "admin", "moderator", "owner"].map((roleOption) => {
              const isAllowed =
                currentRole === "admin" ||
                (currentRole === "moderator" && (roleOption === "user" || roleOption === "owner"));

              return (
                <button
                  key={roleOption}
                  disabled={!isAllowed || selectedUserRole === roleOption}
                  onClick={() => {
                    updateRole(selectedUserId, roleOption);
                    document.getElementById("role_modal").close();
                  }}
                  className={`btn capitalize ${
                    selectedUserRole === roleOption
                      ? "bg-[#ff0000d8] text-white"
                      : "btn-outline"
                  }`}
                >
                  {selectedUserRole === roleOption ? "✓ " : ""} Make{" "}
                  {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Users;
