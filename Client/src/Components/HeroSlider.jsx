import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import Img1 from "../assets/img/heroSlider/1.jpg";
import Img2 from "../assets/img/heroSlider/2.jpg";
import Img3 from "../assets/img/heroSlider/3.jpg";
import { Autoplay, EffectFade } from "swiper/modules";
const slides = [
  {
    title: "Your Luxury Hotel For Vacation",
    bg: Img1,
    btnText: "Room & Suites",
  },
  {
    title: "Your Luxury Hotel For Vacation",
    bg: Img2,
    btnText: "Room & Suites",
  },
  {
    title: "Your Luxury Hotel For Vacation",
    bg: Img3,
    btnText: "Room & Suites",
  },
];
function HeroSlider() {
  return (
    <Swiper
      modules={[EffectFade, Autoplay]}
      effect={"fade"}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="heroSlider h-[600px] lg:h-[860px]"
    >
      {slides.map((slide, index) => {
        const { title, bg, btnText } = slide;
        return (
          <SwiperSlide
            key={index}
            className="h-full bg-pink-400 relative flex justify-center items-center"
          >
            <div className="z-20 text-white text-center">
              <div className="uppercase font-tertiary tracking-[6px]">
                Just Enjoy and Relax
              </div>
              <h1 className="text-[32px] font-primary uppercase tracking-[2px] max-w-[920px] lg:text-[68px] leading-tight mb-6">
                {title}
              </h1>
              <button className="btn btn-lg btn-primary mx-auto">
                {btnText}
              </button>
            </div>
            <div className="absolute top-0 w-full h-full">
              <img className="object-cover h-full w-full" src={bg} alt="" />
            </div>
            <div className="absolute w-full h-full bg-black/70"></div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

export default HeroSlider;
