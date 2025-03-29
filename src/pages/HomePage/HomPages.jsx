import React, { useEffect, useState } from 'react';
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/Images/slider1.webp';
import slider2 from '../../assets/Images/slider2.webp';
import slider3 from '../../assets/Images/slider3.webp';
import CardComponent from '../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import TypeProduct from '../../components/TypeProduct/TypeProduct';

const HomPages = () => {
  const [typeProducts, setTypeProducts] = useState([])
  const searchProduct = useSelector((state) => state?.product?.search);
  // Sử dụng debounce (1000ms) cho giá trị tìm kiếm để tránh gọi API liên tục
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [stateProducts, setStateProducts] = useState([]);
  const [limit, setLimit] = useState(6);

  // Hàm fetch sử dụng context từ react-query
  // Query key được định nghĩa là ['products', search, limit]
  const fetchProductsAll = async (context) => {
    const [, search, limit] = context.queryKey;
    if (search && search.length > 0) {
      const res = await ProductService.getAllProduct(search, limit);
      console.log('res', res);
      return res;
    } else {
      const res = await ProductService.getAllProduct('', limit);
      return res;
    }
  };

  // Sử dụng react-query: queryKey chứa searchDebounce và limit,
  // do đó khi một trong số chúng thay đổi, query sẽ được refetch
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchDebounce, limit],
    queryFn: fetchProductsAll,
    retry: 3,         // Số lần thử lại khi API thất bại
    retryDelay: 1000, // Thời gian chờ giữa các lần retry (milliseconds)
  });

  // Cập nhật stateProducts khi có dữ liệu trả về từ API
  useEffect(() => {
    if (products && products.data && products.data.length > 0) {
      setStateProducts(products.data);
    }
  }, [products]);

const fetchAllTypeProduct = async () =>{
  const res = await ProductService.getAllTypeProduct();
  if(res?.status==='OK'){
    setTypeProducts(res?.data)
  }
}

useEffect(() => {
  fetchAllTypeProduct();
}, []);

  return (
    <div style={{ width: '1270px', margin: '0 auto' }}>
      <WrapperTypeProduct>
        {
          typeProducts.map((item)=>{
            return (
              <TypeProduct name={item} key={item} />
            )
          })
        }
      </WrapperTypeProduct>
      <div className="body" style={{ width: '100%', backgroundColor: '#efefef' }}>
        <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts>
            {products?.data?.map((product) => (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                discount={product.discount}
                selled={product.selled}
                id={product._id}
              />
            ))}
          </WrapperProducts>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            <WrapperButtonMore
              textButton="Xem thêm"
              type="outline"
              styleButton={{
                border: '1px solid rgb(11, 116, 229)',
                color: 'rgb(11, 116, 229)',
                width: '240px',
                height: '38px',
                borderRadius: '4px',
              }}
              // Disable nút nếu số sản phẩm đã load bằng tổng số sản phẩm
              disabled={products?.total === products?.data?.length}

              styleTextButton={{ fontWeight: 500 }}
              onClick={() => setLimit((prev) => prev + 6)}
            />
          </div>
          {/* <NavbarComponent/> */}
        </div>
      </div>
    </div>
  );
};

export default HomPages;
