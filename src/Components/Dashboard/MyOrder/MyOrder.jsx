import React, { useState } from "react";
import useAddFood from "../../Hooks/useAddFood";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useForm } from "react-hook-form";

const MyOrder = () => {
  const [cartFood, refetch] = useAddFood();
  const [quantities, setQuantities] = useState({});
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { user } = useAuth();
  // Function to increment quantity
  const handleIncrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) < 100 ? (prev[id] || 1) + 1 : 100,
    }));
  };

  // Function to decrement quantity
  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) > 1 ? (prev[id] || 1) - 1 : 1,
    }));
  };

  // Function to handle quantity input change
  const handleQuantityChange = (id, value) => {
    const newValue = Math.max(1, Math.min(100, Number(value)));
    setQuantities((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handleRemove = (id) => {

    if (user && user.email) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure.delete(`/addFood/${id}`)
            .then(res => {
              // console.log(res.data);
              refetch()
              if (res.data.deletedCount > 0) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                  color: "red"
                });
              }
            })
        }
      });
    }
  };

  // Calculate Subtotal
  const subtotal = cartFood.reduce((acc, item) => {
    const quantity = quantities[item._id] || 1;
    return acc + item.foodPrice * quantity;
  }, 0);

  const discount = subtotal * 0.15; // 15% discount
  const total = subtotal - discount;
  const onSubmit = (data, id) => {
    if (!id) {
      console.error("Invalid ID:", id);
      Swal.fire("Error!", "Invalid food item ID.", "error");
      return;
    }

    const updatedQuantity = quantities[id] || 1;

    axiosSecure
      .patch(`/addFood/${id}`, { quantity: updatedQuantity })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire("Success!", "Quantity updated successfully.", "success");
        }
      })
      .catch((err) => {
        console.error("Error updating quantity:", err);
        Swal.fire("Error!", "Failed to update quantity.", "error");
      });
  };

  return (
    <div className=" min-h-screen mt-10 px-2 lg:px-5 border-2 ">
      {cartFood.length > 0 ? (
        <div className="mb-11">
          <table className="table ">
            <thead className="bg-[#ff0000d8] rounded-xl text-white">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartFood.map((item) => (
                <tr key={item._id}>
                  <td className="p-4">
                    <div className="flex  items-center gap-2">
                      <div className="avatar">
                        <div className=" h-10 lg:h-16 w-10 lg:w-16  md:mr-0 rounded-md overflow-hidden">
                          <img
                            src={item.foodImage}
                            alt={item.foodName}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className=" grid md:grid-cols-2  ">

                        <p className=" lg:font-bold text-[10px] lg:text-lg text-[#ff1818]">{item.foodName}</p>
                      </div>

                    </div>

                    <p className="text-sm font-semibold ">Price: ${item.foodPrice}</p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-[#ff1818] text-sm font-semibold mt-1 hover:underline"
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>

                  <td className="">
                    <form onSubmit={handleSubmit((data) => onSubmit(data, item._id))}>
                      <div className=" w-[84px]">
                        <div className="mx-auto">
                          <button
                            className="px-3 py-1  rounded hover:bg-gray-300"
                            onClick={() => handleDecrement(item._id)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="w-4 bg-white text-[#ff0000d8] text-center font-bold"
                            name="quantities"
                            value={quantities[item._id] || "" || 1}
                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                            required
                          />

                          <button
                            onClick={() => handleIncrement(item._id)}
                            className="px-3 py-1  rounded hover:bg-gray-300"
                            disabled={(quantities[item._id] || 1) >= 100}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </form>
                  </td>

                  <td>
                    <p className="font-semibold text-[#ff1818]">
                      ${item.foodPrice * (quantities[item._id] || 1)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Order Summary */}
          <div className="mt-6 md:px-20">
            <div className="divider ml-4 divider-error mx-auto"></div>

            <div className="flex justify-evenly md:justify-end gap-12">
              <p className="text-center">Subtotal</p>
              <p className="text-center">${subtotal.toFixed(2)}</p>
            </div>

            <div className="flex justify-evenly md:justify-end gap-12">
              <p className="text-center">Discount (15%)</p>
              <p className="text-center">${discount.toFixed(2)}</p>
            </div>

            <div className="flex justify-evenly md:justify-end gap-12">
              <p className="text-center mr-4">Total</p>
              <p className="text-center ml-3 font-bold text-[#ff1818]">${total.toFixed(2)} </p>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="px-3 md:px-1">
            <Link to={"/dashboard/checkOutForm"}>
              <button className="btn w-full mt-4 font-Kanit btn-outline bg-[#ff0000d8] hover:bg-[#ff0000d8] text-white hover:text-white ">
                Confirm Order
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen justify-center pt-28 items-center">
          <img
            className="w-16 mx-auto rounded-2xl"
            src={"https://i.ibb.co.com/88JDM0z/remove-from-cart-12316609.png"}
            alt=""
          />
          <p className="text-center font-bold text-red-600">Your cart is empty</p>
          <p className="text-center">Continue shopping</p>
          <Link className="" to={"/"}>
            <p className="text-center border-2 p-2 w-24 mx-auto mt-2">EXPLORE</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
