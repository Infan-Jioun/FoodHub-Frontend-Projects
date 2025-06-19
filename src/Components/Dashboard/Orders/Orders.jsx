import React from 'react';
import useRestaurantOrders from '../../Hooks/useRestaurantOrders';

const red = '#ff0000d8';

const Orders = () => {
  const { data: orders = [], isLoading } = useRestaurantOrders();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-lg text-gray-600">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6 border border-red-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-red-100">
          Orders for Your Restaurant
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden text-sm">
              <thead className="bg-[#ff0000d8] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Food Items</th>
                  <th className="py-3 px-4 text-left">Total Quantity</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order, idx) => {
                  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={order._id} className="hover:bg-red-50 transition">
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4">{order.customerName}</td>
                      <td className="py-3 px-4">{order.district}, {order.division}</td>
                      <td className="py-3 px-4">
                        <ul className="list-disc list-inside space-y-1">
                          {order.items.map((item, i) => (
                            <li key={i}>
                              {item.foodName} x <span className="font-semibold">{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 px-4">{totalQty}</td>
                      <td className="py-3 px-4 capitalize font-medium text-gray-700">
                        <span className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
