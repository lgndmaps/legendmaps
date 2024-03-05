import React from "react";
import Slider from "react-slick";

const CarouselHome = ({ children }) => {
    const settings = {
        dots: false,
        pauseOnHover: true,
        infinite: true,
        fade: true,
        arrows: false,
        autoplay: true,
        pauseOnFocus: false,
        autoplaySpeed: 3500,
        lazyload: "progressive",
        slidesToShow: 1,
        slidesToScroll: 1,
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

export default CarouselHome;
