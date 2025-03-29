import React, { useEffect } from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Col, Pagination, Row } from 'antd';
import { WrapperNavbar, WrapperProducts } from './style';
import { useLocation } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import { useState } from 'react';

const TypeProductPage = () => {
  const {state} = useLocation();
  const [products,setProducts] = useState([])
  const fetchProductType = async (type) => {
    const res = await ProductService.getProductType(type);
    if(res.status == 'OK'){
      setProducts(res?.data);
    }else{

    }
    console.log('res', res);
  };

  useEffect(() => {
  if(state){
    fetchProductType(state);
  }

  }, [state]);

  const onChange = () => {
    // Xử lý khi thay đổi trang (Pagination)
  };

  return (
    <div style={{ width: '100%', background: '#efefef' }}>
      <div style={{ width: '1278px', margin: '0 auto' }}>
        <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>
          <WrapperNavbar span={4}>
            <NavbarComponent />
          </WrapperNavbar>
          <Col span={20}>
            <WrapperProducts>
              {products?.map((products)=>{
                 return (
                  <CardComponent 
                  key={products._id}
                countInStock={products.countInStock}
                description={products.description}
                image={products.image}
                name={products.name}
                price={products.price}
                rating={products.rating}
                type={products.type}
                discount={products.discount}
                selled={products.selled}
                id={products._id}
                  />
                 )
              })}
            </WrapperProducts>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Pagination defaultCurrent={2} total={100} onChange={onChange} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TypeProductPage;
