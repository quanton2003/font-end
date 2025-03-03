import { Image } from 'antd';
import React from 'react';
import Slider from 'react-slick';

const SliderComponent = ({ arrImages }) => {
    var settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Bật tự động chạy
        autoplaySpeed: 1000, // Chạy mỗi 1 giây
    };

    return (
        <Slider {...settings}>
            {arrImages.map((image, index) => (
                <div key={index}>
                    <Image src={image} alt="slider"  preview={false} height="274px"  width="100%" />
                </div>
            ))}
        </Slider>
    );
}

export default SliderComponent;
