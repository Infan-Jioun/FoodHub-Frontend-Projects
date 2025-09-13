import React, { useState, useEffect } from "react";
import useAddFood from "../../Hooks/useAddFood";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const MyOrder = () => {
  const [cartFood, refetch] = useAddFood();
  const [quantities, setQuantities] = useState({});
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const initialQuantities = {};
    cartFood.forEach(item => {
      initialQuantities[item._id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [cartFood]);

  const handleIncrement = async (id) => {
    const newQuantity = Math.min(100, (quantities[id] || 1) + 1);
    await updateQuantity(id, newQuantity);
  };

  const handleDecrement = async (id) => {
    const newQuantity = Math.max(1, (quantities[id] || 1) - 1);
    await updateQuantity(id, newQuantity);
  };

  const handleQuantityChange = async (id, value) => {
    const newValue = Math.max(1, Math.min(100, Number(value)));
    await updateQuantity(id, newValue);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      setQuantities(prev => ({ ...prev, [id]: newQuantity }));

      const res = await axiosSecure.patch(`/addFood/${id}`, { quantity: newQuantity });

      if (res.data.modifiedCount > 0) {
        refetch();
      } else {
        setQuantities(prev => ({ ...prev, [id]: prev[id] }));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Swal.fire("Error!", "Failed to update quantity.", "error");
      setQuantities(prev => ({ ...prev, [id]: prev[id] }));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = (id) => {
    if (user && user.email) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff1818",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure.delete(`/addFood/${id}`).then((res) => {
            refetch();
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your item has been removed.",
                icon: "success",
                confirmButtonColor: "#ff1818",
              });
            }
          });
        }
      });
    }
  };

  const subtotal = cartFood.reduce(
    (acc, item) => acc + item.foodPrice * (quantities[item._id] || 1),
    0
  );

  const discount = subtotal * 0.15;
  const total = subtotal - discount;


  return (
    <div >
     
      <div className="min-h-screen mt-10 px-4 lg:px-20  rounded-lg ">

        {cartFood.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full table-auto border-collapse text-sm md:text-base">
                <thead>
                  <tr className="bg-[#ff1818] text-white rounded-t-lg">
                    <th className="py-3 px-4 text-left rounded-tl-lg">Product</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right rounded-tr-lg">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartFood.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 hover:bg-red-50 transition"
                    >
                      <td className="flex items-center gap-4 py-4 px-4">
                        <div className="h-14 w-14 rounded-md overflow-hidden shadow-md flex-shrink-0">
                          <img
                            src={item.foodImage}
                            alt={item.foodName}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#ff1818] text-lg">
                            {item.foodName}
                          </p>
                          <p className="text-gray-600 mt-1">
                            Price: ${item.foodPrice.toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="flex items-center text-[#ff1818] mt-2 hover:underline text-sm font-medium"
                          >
                            <MdDeleteOutline size={20} />
                            <span className="ml-1">Remove</span>
                          </button>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center border rounded-md overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleDecrement(item._id)}
                            disabled={isUpdating}
                            className={`px-3 py-1 text-xl font-bold text-[#ff1818] hover:bg-[#ff1818] hover:text-white transition ${isUpdating ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={quantities[item._id] || 1}
                            onChange={(e) =>
                              handleQuantityChange(item._id, e.target.value)
                            }
                            className="w-10  text-center font-semibold bg-white text-[#ff1818] focus:outline-none"
                            disabled={isUpdating}
                          />
                          <button
                            type="button"
                            onClick={() => handleIncrement(item._id)}
                            disabled={isUpdating}
                            className={`px-3 py-1 text-xl font-bold text-[#ff1818] hover:bg-[#ff1818] hover:text-white transition ${isUpdating ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-right font-semibold text-[#ff1818] py-4 px-4">
                        ${(item.foodPrice * (quantities[item._id] || 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6">
              {cartFood.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-md overflow-hidden shadow-md flex-shrink-0">
                      <img
                        src={item.foodImage}
                        alt={item.foodName}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-[#ff1818] text-lg truncate">
                        {item.foodName}
                      </p>
                      <p className="text-gray-600 mt-1">
                        Price: ${item.foodPrice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-[#ff1818] hover:text-[#ff1818] transition"
                      aria-label={`Remove ${item.foodName}`}
                    >
                      <MdDeleteOutline size={24} />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center border rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleDecrement(item._id)}
                        disabled={isUpdating}
                        className={`px-3 py-1 text-xl font-bold text-[#ff1818] hover:bg-[#ff1818] hover:text-white transition ${isUpdating ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={quantities[item._id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(item._id, e.target.value)
                        }
                        className="w-16 text-center font-semibold text-[#ff1818] focus:outline-none"
                        disabled={isUpdating}
                      />
                      <button
                        type="button"
                        onClick={() => handleIncrement(item._id)}
                        disabled={isUpdating}
                        className={`px-3 py-1 text-xl font-bold text-[#ff1818] hover:bg-[#ff1818] hover:text-white transition ${isUpdating ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      >
                        +
                      </button>
                    </div>
                    <div className="font-semibold text-[#ff1818] text-lg">
                      ${(item.foodPrice * (quantities[item._id] || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="max-w-md mx-auto mt-10 p-6 bg-[#fff0f0] rounded-lg shadow-md text-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-[#ff1818]">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-[#ff1818]">
                <span>Discount (15%)</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
              <hr className="border-red-300 mb-3" />
              <div className="flex justify-between font-bold text-[#ff1818] text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="max-w-md mx-auto mt-6 px-4">
              <Link to={"/dashboard/checkOutForm"}>
                <button className="w-full bg-[#ff1818] hover:bg-[#e60000] text-white font-semibold py-3 rounded-lg transition">
                  Confirm Order
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-600 px-4">
            <img
              className="w-20 mb-6"
              src="https://i.ibb.co/88JDM0z/remove-from-cart-12316609.png"
              alt="Empty cart"
            />
            <p className="text-xl font-bold text-[#ff1818] mb-2">Your cart is empty</p>
            <p className="mb-4">Continue shopping to add delicious foods!</p>
            <Link to={"/"}>
              <button className="border-2 border-[#ff1818] text-[#ff1818] px-6 py-2 rounded-lg hover:bg-[#ff1818] hover:text-white transition">
                EXPLORE
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
