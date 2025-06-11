import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const useAddFood = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: cartFood = [], refetch } = useQuery({
        queryKey: ['cartFood', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/addFood?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email, // only fetch when user email is available
    });

    const handleRemove = (id) => {
        if (user && user.email) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosSecure.delete(`/addFood/${id}`).then((res) => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Your item has been deleted.',
                                icon: 'success',
                                color: 'red',
                            });
                        }
                    });
                }
            });
        }
    };

    return [cartFood, refetch, handleRemove];
};

export default useAddFood;
