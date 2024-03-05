import { useEffect, useState } from "react";

export const useOnScroll = (scrollPoint?: number) => {
    const [isScrolled, setIsScrolled] = useState(false);

    const onScroll = () => {
        const position = window.pageYOffset;
        if (position > scrollPoint) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("scroll", onScroll);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return { isScrolled };
};
