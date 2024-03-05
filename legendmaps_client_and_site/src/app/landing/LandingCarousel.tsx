import CarouselHome from "../components/CarouselHome";
import Image from "next/image";
import styled from "styled-components";

const SliderImage = styled(Image)`
  align-self: center,
  padding: 0rem,
  maring: 0rem,
  width: 100%,
`;
const LandingCarousel = () => {
    return (
        <div style={{width: "100%", border: "1px solid #333"}}>
            <CarouselHome>
                <div className="carousel-slide">
                    <span>
                        <SliderImage
                            src={"/images/a.png"}
                            width={1000}
                            height={596}
                            quality={100}
                            alt="adv"
                        />


                    </span>
                </div>

                <div className="carousel-slide">
                    <span>
                        <SliderImage
                            src={"/images/b.png"}
                            width={1000}
                            height={596}
                            quality={100}
                            alt="adv"
                        />


                    </span>
                </div>

                <div className="carousel-slide">
                    <span>
                        <SliderImage
                            src={"/images/c.png"}
                            width={1000}
                            height={596}
                            quality={100}
                            alt="adv"
                        />


                    </span>
                </div>

                <div className="carousel-slide">
                    <span>
                        <SliderImage
                            src={"/images/d.png"}
                            width={1000}
                            height={596}
                            quality={100}
                            alt="adv"
                        />


                    </span>
                </div>

                <div className="carousel-slide">
                    <span>
                        <SliderImage
                            src={"/images/e.png"}
                            width={1000}
                            height={596}
                            quality={100}
                            alt="adv"
                        />


                    </span>
                </div>

                <div className="carousel-slide">
                    <span>
                        <SliderImage
                            src={"/images/f.png"}
                            width={1000}
                            height={596}
                            quality={100}
                            alt="adv"
                        />


                    </span>
                </div>

                <div className="carousel-slide">
                    <span>
                        <SliderImage
                            src={"/images/g.png"}
                            width={1000}
                            height={596}
                            quality={100}
                            alt="adv"
                        />


                    </span>
                </div>

                <div className="carousel-slide">
                    <span>
                        <SliderImage
                            src={"/images/h.png"}
                            width={1000}
                            height={596}
                            quality={100}
                            alt="adv"
                        />


                    </span>
                </div>
            </CarouselHome>
        </div>
    );
};

export default LandingCarousel;
