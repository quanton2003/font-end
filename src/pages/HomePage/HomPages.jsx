import React from 'react';
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/Images/slider1.webp';
import slider2 from '../../assets/Images/slider2.webp';
import slider3 from '../../assets/Images/slider3.webp';
import CardComponent from '../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService'
const HomPages = () => {
  const arr = ['TV', 'Tủ lạnh', 'laptop'];
  const fetchProductsAll = async () => {
    const res = await ProductService.getAllProduct(); // ✅ Đảm bảo trả về dữ liệu
    return res
};

const { data: products, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProductsAll,
  retry: 3,  // ✅ Số lần thử lại khi API thất bại
  retryDelay: 10, // ✅ Thời gian chờ giữa các lần retry (milliseconds)
});
  
  console.log('data',products);
  

  return (
    <>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
          <div id='container' style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
            <SliderComponent arrImages={[slider1, slider2, slider3]} />

            <WrapperProducts>
  {products?.data?.map((product) => (
    <CardComponent 
      key={product._id}  // ✅ Đã sửa đúng key
      countInStock={product.countInStock}
      description={product.description}
      image={product.image}
      name={product.name}
      price={product.price}
      rating={product.rating}
      type={product.type}
      discount={product.discount}
      selled={product.selled}
    />
  ))}
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