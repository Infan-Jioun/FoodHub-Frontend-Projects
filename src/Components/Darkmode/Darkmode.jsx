import { useSelect } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { IoSunnyOutline } from "react-icons/io5";
import { LuSunMoon } from "react-icons/lu";
export const Darkmode = () => {
 const [isDarkMode, setDarkMode] = useState(() => {
     return   localStorage.getItem("isDarkMode") === "true";
    })
    const toggleTheme = () => {
       setDarkMode((prevMode) => {
        const newMode = !prevMode;
        localStorage.setItem("isDarkMode" , newMode);
        return newMode;
       })
    }
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("bg-black",  "text-white");
            document.body.classList.remove("bg-white", "text-black");
        }
        else {
            document.body.classList.add("bg-white", "text-black");
            document.body.classList.remove("bg-black",  "text-white");

        }
    }, [isDarkMode])

    return (
        <div>
            <button aria-label="Dark Mode" className="swap swap-rotate" onClick={toggleTheme}>
                {isDarkMode ? <LuSunMoon size={25} data-aos="zoom-in" /> : <IoSunnyOutline data-aos="zoom-in" size={25} />}
            </button>
        </div>
    );
};

export default Darkmode;