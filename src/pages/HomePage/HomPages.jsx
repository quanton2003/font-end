import React from 'react';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/Images/slider1.webp';
import slider2 from '../../assets/Images/slider2.webp';
import slider3 from '../../assets/Images/slider3.webp';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import ButtonComponent from '../../components/ButttonComponent/ButttonComponent';


const HomPages = () => {
  const arr = ['TV', 'Tủ lạnh', 'laptop'];

  return (
    <>
      <div>

        <div id="container" style={{ backgroundColor: "#efefef", padding: "0 120px",height:"1000px",width:'100%' }} >
        <WrapperTypeProduct>
          {arr.map((item) => {
            return <TypeProduct name={item} key={item} />; // key để tránh lỗi duplicate key của react
          })}
        </WrapperTypeProduct>
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts>
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
          </WrapperProducts>
         <div style={{ width: '100%', display:'flex', alignItems:'center', marginTop:'10px',justifyContent:'center' }} >
         <WrapperButtonMore styleButton={{ border:"1px solid rgb(11,116,229)" , color:'rgb(11,116,229)',width:"240px",height:'38px', borderRadius:'4px' 
        }} styleTextButton={{ fontWeight: 500  }} textButton="Xem Thêm" type="outline" />
         </div>
         
          {/* <NavbarComponent/> */}
        </div>
      </div>
    </>
  );
};

export default HomPages;
