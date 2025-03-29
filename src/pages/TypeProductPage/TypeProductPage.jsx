import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Pagination } from 'antd';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { WrapperNavbar, WrapperProducts } from './style';
import * as ProductService from '../../services/ProductService';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [panigate, setPanigate] = useState({
    page: 1,       // Nên để page bắt đầu từ 1
    limit: 10,
    total: 0
  });

  // Gọi API
  const fetchProductType = async (type, page, limit) => {
    const res = await ProductService.getProductType(type, page, limit);
    if (res?.status === 'OK') {
      setProducts(res?.data);
      // Chỉ set nếu total khác
      if (res?.total !== panigate.total) {
        setPanigate(prev => ({ ...prev, total: res.total }));
      }
    }
  };

  // Mỗi khi state, page hoặc limit thay đổi -> gọi API
  useEffect(() => {
    if (state) {
      fetchProductType(state, panigate.page, panigate.limit);
    }
  }, [state, panigate.page, panigate.limit]);



  // Hàm thay đổi page/limit
  const onChange = (current, pageSize) => {
    setPanigate(prev => ({
      ...prev,
      page: current,
      limit: pageSize
    }));
  };

  return (
    <div style={{ width: '100%', background: '#efefef' }}>
      <div style={{ width: '1278px', margin: '0 auto', height: '100%' }}>
        <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)' }}>
          <WrapperNavbar span={4}>
            <NavbarComponent />
          </WrapperNavbar>
          <Col span={20}>
            <WrapperProducts>
              {products?.filter((pro)=>{
                if (searchDebounce === ''){
                    return pro
                }else if(pro?.name?.toLowerCase()?.includes(searchDebounce.toLowerCase())){
                  return pro
                }
                }).map((product) => (
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
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Pagination
                current={panigate.page}
                pageSize={panigate.limit}
                total={panigate.total} // Dùng total trả về từ API
                onChange={onChange}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TypeProductPage;
