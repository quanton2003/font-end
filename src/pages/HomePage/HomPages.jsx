import React from 'react';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { WrapperTypeProduct } from './style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/slider1.webp';
import slider2 from '../../assets/slider2.webp';
import slider3 from '../../assets/slider3.webp';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
const HomPages = () => {
  const arr = ['TV', 'Tủ lạnh', 'laptop'];

  return (
    <>
      <div>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return <TypeProduct name={item} key={item} />; // key để tránh lỗi duplicate key của react
          })}
        </WrapperTypeProduct>
        <div id="container" style={{ backgroundColor: "#efefef", padding: "0 120px",height:"1000px" }} >
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '20px' }} >
            <CardComponent />
          </div>
          <NavbarComponent/>
        </div>
      </div>
    </>
  );
};

export default HomPages;
