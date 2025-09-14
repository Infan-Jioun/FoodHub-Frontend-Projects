import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Rating,
  Button,
} from "@material-tailwind/react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

const FoodReviewModal = ({ open, onClose, payment }) => {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [reviewedItems, setReviewedItems] = useState([]);
  const axiosSecure = useAxiosSecure();


  useEffect(() => {
    const reviewed =
      payment?.items
        ?.filter((item) => item?.alreadyReviewed || item?.isReviewed)
        .map((item) => item.foodName) || [];
    setReviewedItems(reviewed);
  }, [payment]);

  const handleReview = async (item) => {
    const foodRating = ratings[item.foodName];
    const foodComment = comments[item.foodName];

    if (reviewedItems.includes(item.foodName)) {
      toast.error(`${item.foodName} already reviewed!`);
      return;
    }

    if (!foodRating || !foodComment) {
      toast.error("Please add both rating & comment!");
      return;
    }

    const reviewData = {
      customerName: payment.customerName || "Anonymous",
      customerEmail: payment.email,
      foodName: item.foodName,
      restaurantName: item.restaurantName,
      rating: foodRating,
      comment: foodComment,
      date: new Date(),
    };

    try {
      const res = await axiosSecure.patch(
        `/restaurantUpload/${encodeURIComponent(
          item.restaurantName
        )}/${encodeURIComponent(item.foodName)}`,
        { reviewData }
      );

      if (res.data?.success) {
        toast.success(`${item.foodName} reviewed!`);
        setReviewedItems((prev) => [...prev, item.foodName]); // mark reviewed
      } else {
        toast.error(res.data?.message || `Failed to review ${item.foodName}`);
      }
    } catch (err) {
      console.error("Review Error:", err);
      toast.error(`Error reviewing ${item.foodName}`);
    }
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="rounded-xl shadow-xl"
    >
      {/* Header */}
      <DialogHeader className="flex flex-col items-center border-b border-gray-200 pb-4 bg-gray-50 rounded-t-xl">
        <div className="text-2xl font-bold text-[#ff1818]">Food Review</div>
        <div className="text-sm text-gray-500 mt-1">
          Rate & share feedback for your ordered items
        </div>
      </DialogHeader>

      {/* Body */}
      <DialogBody className="space-y-5 max-h-[65vh] overflow-y-auto px-6 py-4">
        {payment?.items?.map((item, idx) => {
          const alreadyReviewed = reviewedItems.includes(item.foodName);

          return (
            <div
              key={idx}
              className={`border rounded-xl p-4 transition-all duration-200 ${alreadyReviewed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200 hover:shadow-md"
                }`}
            >
              {/* Top Info */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.foodName}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-[#ff1818]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                    </svg>
                    {item.restaurantName}
                  </p>
                </div>

                {alreadyReviewed && (
                  <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Reviewed
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="mb-3 flex items-center">
                <Rating
                  value={ratings[item.foodName] || 0}
                  onChange={(value) =>
                    setRatings({ ...ratings, [item.foodName]: value })
                  }
                  readonly={alreadyReviewed}
                  ratedColor="#ff1818"
                  className="flex gap-1"
                />
                {ratings[item.foodName] ? (
                  <span className="text-sm text-gray-600 ml-2">
                    ({ratings[item.foodName]}.0)
                  </span>
                ) : null}
              </div>

              {/* Comment Box */}
              <textarea
                className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#ff1818] focus:border-transparent transition-all ${alreadyReviewed
                    ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border-gray-300 text-gray-700 hover:border-[#ff1818]"
                  }`}
                rows="3"
                placeholder={
                  alreadyReviewed
                    ? "Your review has been submitted"
                    : "Share your honest feedback about this dish..."
                }
                disabled={alreadyReviewed}
                value={comments[item.foodName] || ""}
                onChange={(e) =>
                  setComments({ ...comments, [item.foodName]: e.target.value })
                }
              />

              {/* Submit Button */}
              <div className="flex justify-end mt-3">
                <Button
                  onClick={() => handleReview(item)}
                  className={`px-4 py-2 rounded-lg shadow-md text-white transition-all ${alreadyReviewed
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#ff1818] hover:bg-[#e60000]"
                    }`}
                  disabled={alreadyReviewed}
                >
                  {alreadyReviewed ? "Already Reviewed" : "Submit Review"}
                </Button>
              </div>
            </div>
          );
        })}
      </DialogBody>

      {/* Footer */}
      <DialogFooter className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
        <Button
          variant="text"
          onClick={onClose}
          className="mr-2 text-gray-600 hover:bg-gray-100 border border-gray-300"
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default FoodReviewModal;
