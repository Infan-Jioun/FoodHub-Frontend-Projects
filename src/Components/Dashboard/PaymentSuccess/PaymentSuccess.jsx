import React from 'react';
import useAuth from '../../Hooks/useAuth';
import { Link } from 'react-router-dom';
import { PiHamburgerThin } from 'react-icons/pi';

const PaymentSuccess = () => {
    const {user} = useAuth();
    return (
        <div className='max-w-7xl mx-auto flex justify-center items-center min-h-screen'>
            <div>
            <img className='w-44 mx-auto mix-blend-darken' src="https://i.ibb.co.com/jkWC6Qn3/contactless-payment-15575616.gif" alt="" />
             <p className='font-bold text-xl text-center text-green-600 ' >Payment Success <span className='font-bold text-[#ff1818]'>{user?.displayName}</span></p>
             <br />
             <Link to={"https://foodhub-d3e1e.web.app/restaurants"}><p className=' bg-[#ff1818] text-white rounded-xl hover:bg-[#ff1818] hover:text-white  text-center mt-3 flex items-center justify-center gap-2 '>Order More Food <PiHamburgerThin /></p></Link>
            </div>
            
        </div>
    );
};

export default PaymentSuccess;