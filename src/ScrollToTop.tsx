import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        lenis.scrollTo(0, {
            duration: 1.2,
            immediate: false,
        });
    }, [pathname, lenis]);

    return null;
};

export default ScrollToTop;