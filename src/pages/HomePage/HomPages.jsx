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
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
          <div id='container' style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
            <SliderComponent arrImages={[slider1, slider2, slider3]} />

            <WrapperProducts>
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </WrapperProducts>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <WrapperButtonMore
                textButton="Xem thêm"
                type="outline"
                styleButton={{
                  border: '1px solid rgb(11, 116, 229)',
                  color: 'rgb(11, 116, 229)',
                  width: '240px',
                  height: '38px',
                  borderRadius: '4px'
                }}
                styleTextButton={{ fontWeight: 500 }}
              />
            </div>

            {/* <NavbarComponent/> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomPages;
