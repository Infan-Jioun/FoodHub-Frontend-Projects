import React, { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Rating } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth';

const WebsiteReviewModal = ({ open, onClose }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axiosSecure.get(`/website-review?email=${user.email}`);
                if (res.data?.review) {
                    const r = res.data.review;
                    setAlreadyReviewed(true);
                    setRating(r.rating);
                    setComment(r.comment);
                    setPhotoURL(r.photoURL || user.photoURL);
                } else {
                    setPhotoURL(user.photoURL);
                }
            } catch (err) {
                console.log(err);
            }
        };

        if (user?.email) fetchReview();
    }, [user?.email, axiosSecure]);

    const handleSubmit = async () => {
        if (!rating || !comment) {
            return toast.error('Please provide rating and comment');
        }

        setLoading(true);
        try {
            const res = await axiosSecure.post('/website-review', {
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                rating,
                comment,
                date: new Date(),
            });
            toast.success(res.data.message);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogHeader>
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    FoodHub Website Review
                </motion.div>
            </DialogHeader>

            <DialogBody>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex items-center gap-3">
                        {photoURL && (
                            <motion.img
                                src={photoURL}
                                alt={user.displayName}
                                className="w-10 h-10 rounded-full"
                                whileHover={{ scale: 1.1 }}
                            />
                        )}
                        <span className="font-medium">{user.displayName}</span>
                    </div>

                    <Rating
                        value={rating}
                        readOnly={alreadyReviewed}
                        onChange={(value) => setRating(value)}
                    />

                    <textarea
                        className={`w-full border rounded-lg p-2 ${alreadyReviewed ? 'bg-gray-100' : 'bg-white'}`}
                        rows={4}
                        placeholder={alreadyReviewed ? '' : 'Write your review...'}
                        value={comment}
                        readOnly={alreadyReviewed}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {alreadyReviewed && (
                        <p className="text-sm text-green-600">
                            You have already submitted a review.
                        </p>
                    )}
                </motion.div>
            </DialogBody>

            <DialogFooter className="flex gap-2">
                <Button variant="text" onClick={onClose}>
                    Cancel
                </Button>
                {!alreadyReviewed && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full"
                    >
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#ff1818] hover:bg-[#e01616] text-white w-full"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </motion.div>
                )}
            </DialogFooter>
        </Dialog>
    );
};

export default WebsiteReviewModal;
