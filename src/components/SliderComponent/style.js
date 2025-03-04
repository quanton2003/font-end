import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export const WrapperSliderStyle = styled(Slider)`
  .slick-arrow.slick-prev {
    left: 12px;
    top: 50%;
    z-index: 10;
    &:before {
      font-size: 40px;
      color: white;
    }
  }

  .slick-arrow.slick-next {
    right: 28px;
    top: 50%;
    z-index: 10;
    &:before {
      font-size: 40px;
      color: white;
    }
  }

  .slick-dots {
    z-index: 10;
    bottom: -2px !important;
    li {
      button {
        &::before {
          color: rgba(255, 255, 0, 0.5);
        }
      }
    }
  }

  .slick-dots li.slick-active {
    button {
      &::before {
        color: white;
      }
    }
  }
`;
