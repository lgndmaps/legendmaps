import React from "react";
import Slider from "react-slick";

const Carousel = ({ children }) => {
    const settings = {
        dots: true,
        pauseOnHover: true,
        infinite: true,
        fade: false,
        arrows: false,
        autoplay: true,
        pauseOnFocus: false,
        autoplaySpeed: 3500,
        lazyload: "progressive",
        slidesToShow: 2,
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    return <Slider {...settings}>{children}</Slider>;
};

export default Carousel;
