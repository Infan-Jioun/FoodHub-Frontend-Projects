import useAllUserHooks from "../../Hooks/useAllUserHooks";
import { MdOutlineAdminPanelSettings, MdOutlineRestaurant } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import {
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useSpring, useMotionValue } from "framer-motion";

const CountUp = ({ to, from = 0, duration = 2, separator = ",", className = "" }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };
        const formatted = Intl.NumberFormat("en-US", options).format(latest.toFixed(0));
        ref.current.textContent = separator
          ? formatted.replace(/,/g, separator)
          : formatted;
      }
    });
    motionValue.set(to);
    return () => unsubscribe();
  }, [springValue, to, separator, motionValue]);

  return <span className={className} ref={ref} />;
};

const Users = () => {
  const [users, , refetch] = useAllUserHooks();
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const axiosSecure = useAxiosSecure();

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const TABLE_HEAD = ["Information", "Action", "Admin", "Moderator", "Owner"];

  const filteredUsers = users.filter((user) => {
    const userSearch =
      user.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchInput.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "admin" && user?.role === "admin") ||
      (activeTab === "moderator" && user?.role === "moderator") ||
      (activeTab === "owner" && user?.role === "owner");

    return userSearch && matchesTab;
  });

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${userId}`).then(() => {
          refetch();
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        });
      }
    });
  };

  const handleRoleUpdate = (role, id) => {
    axiosSecure.patch(`/users/${role}/${id}`).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetch();
        toast.success(
          `Successfully updated to ${role.charAt(0).toUpperCase() + role.slice(1)}`
        );
        setOpenModal(false);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 flex flex-col md:flex-row  items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[#ff1818] mt-4">
          Manage Users{" "}
          <CountUp
            from={0}
            to={users.length}
            separator=","
            duration={2}
            className="text-4xl font-bold text-center text-[#ff1818]"
          />
        </h2>
        <div className="w-full px-4 md:w-64">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute h-4 w-4 text-[#ff1818] top-3 right-3" />
            <Input
              type="text"
              className="pl-10 text-[#ff1818] font-bold"
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              label="Search"
              color="red"
            />
          </div>
        </div>
      </div>

      <div className="tabs mb-4  flex justify-center md:justify-start gap-2">
        {["all", "admin", "moderator", "owner"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === tab
                ? "bg-red-800 text-white font-bold"
                : "text-red-800 bg-white border border-red-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto  rounded-lg border">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-4 py-2 text-xs text-[#ff1818] text-center uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b ">
                  <td className="px-4 py-2 text-sm ">
                    <div
                      className="flex  space-x-3 cursor-pointer"
                      onClick={() => handleOpenModal(user)}
                    >
                      <img
                        src={user.photo || "https://i.ibb.co/PGwHS087/profile-Imagw.jpg"}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p>{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-xl text-red-600"
                    >
                      <AiOutlineUserDelete />
                    </button>
                  </td>
                  <td className="text-center">
                    {user.role === "admin" ? (
                      "Admin"
                    ) : (
                      <button
                        onClick={() => handleRoleUpdate("admin", user._id)}
                        className="text-xl text-green-600"
                      >
                        <MdOutlineAdminPanelSettings />
                      </button>
                    )}
                  </td>
                  <td className="text-center">
                    {user.role === "moderator" ? (
                      "Moderator"
                    ) : (
                      <button
                        onClick={() => handleRoleUpdate("moderator", user._id)}
                        className="text-xl text-blue-600"
                      >
                        <MdOutlineAdminPanelSettings />
                      </button>
                    )}
                  </td>
                  <td className="text-center">
                    {user.role === "owner" ? (
                      "Owner"
                    ) : (
                      <button
                        onClick={() => handleRoleUpdate("restaurantOwner", user._id)}
                        className="text-xl text-orange-500"
                      >
                        <MdOutlineRestaurant />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Role Modal with Buttons */}
      {selectedUser && (
        <Dialog open={openModal} handler={() => setOpenModal(false)}>
          <DialogHeader>User Details</DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-2">
              <img
                src={selectedUser.photo || "https://i.ibb.co/PGwHS087/profile-Imagw.jpg"}
                className="w-20 h-20 rounded-full mx-auto"
                alt=""
              />
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              {selectedUser.restaurantAdddress && (
                <p><strong>Restaurant Address:</strong> {selectedUser.restaurantAdddress}</p>
              )}
              {selectedUser.restaurantNumber && (
                <p><strong>Contact:</strong> {selectedUser.restaurantNumber}</p>
              )}
              <p><strong>Current Role:</strong> {selectedUser.role}</p>

              <div className="flex gap-2 mt-4">
                <Button
                  color="green"
                  onClick={() => handleRoleUpdate("admin", selectedUser._id)}
                >
                  Make Admin
                </Button>
                <Button
                  color="blue"
                  onClick={() => handleRoleUpdate("moderator", selectedUser._id)}
                >
                  Make Moderator
                </Button>
                <Button
                  color="orange"
                  onClick={() => handleRoleUpdate("restaurantOwner", selectedUser._id)}
                >
                  Make Owner
                </Button>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button color="red" onClick={() => setOpenModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default Users;
