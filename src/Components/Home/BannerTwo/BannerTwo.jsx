import { Link } from "react-router-dom";


const BannerTwo = () => {
  
    return (
        <div className="mt-5"> 
          
            <div className="max-w-7xl mx-auto grid sm:grid-cols-2 px-4 justify-center items-center md:gap-3 lg:gap-6  md:px-10 lg:px-16">
                 <div className=" sm:px-4"> 
                    <img className="" src="https://i.ibb.co.com/VJTbsNp/welcome-bg-png.webp" alt="" />
                 </div>
                 <div>
                    <div className="  md:w-80 lg:w-96">
                        <p className=" md:text-sm lg:text-[16px] md:mt-10">
                            Created god gathered don't you yielding herb you had. And isn't, god was saw. Dominion. Great sixth for in unto was. Open can't tree am waters brought. Divide after there.
                        </p>
                        <br />
                        <p className="md:text-sm lg:text-[16px]">
                        Created god gathered don't you yielding herb you had. And isn't, god was saw. Dominion. Great sixth for in unto was. Open can't tree waters brought. Divide after there. Was. Created god gathered don't you yielding herb you had. And isn't god.
                        </p>
                        <div className="w-60 "> 
                   <Link to={"https://foodhub-d3e1e.web.app/restaurantUpload/7dayz"}>     <button className={`rounded  mt-5 border-2 p-3 px-3 border-red-500  bg-[#ff0000d8] text-white font-semibold hover:transition-colors  hover:bg-white hover:text-red-600`}>BOOK A FOOD</button></Link>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default BannerTwo;