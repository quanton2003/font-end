import React, { useState } from 'react';
import { Col, Image, Row, InputNumber } from 'antd';
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import {
  WrapperAddressProduct,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from './style';
import ButtonComponent from '../ButttonComponent/ButttonComponent';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

const ProductDetalilsComponent = ({ idProduct }) => {
  const [quantity, setQuantity] = useState(1);
  const userAddress = useSelector((state) => state?.user?.address); // Lấy địa chỉ từ Redux

  const fetchGetDetailsProduct = async (id) => {
    if (!id) return null;
    const res = await ProductService.getDetailsProduct(id);
    return res.data;
  };

  const { data: productDetails, isLoading, isError } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: () => fetchGetDetailsProduct(idProduct),
    enabled: !!idProduct,
  });

  if (isLoading) return <div>Đang tải dữ liệu sản phẩm...</div>;
  if (isError) return <div>Đã có lỗi xảy ra khi tải dữ liệu sản phẩm.</div>;
  if (!productDetails) return <div>Không tìm thấy thông tin sản phẩm.</div>;

  const { name, price, rating, image, countInStock, selled } = productDetails;

  const handleIncrease = () => {
    setQuantity((prev) => (countInStock ? Math.min(prev + 1, countInStock) : prev + 1));
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (value) => {
    setQuantity(value);
  };

  return (
    <Row style={{ padding: '16px', background: '#fff', borderRadius: '8px' }}>
      <Col
        span={10}
        style={{
          borderRight: '1px solid #e5e5e5',
          paddingRight: '8px',
        }}
      >
        <Image src={image || 'https://via.placeholder.com/300'} alt="image product" preview={false} />
        <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <WrapperStyleColImage span={4} key={item}>
              <WrapperStyleImageSmall
                src={image || 'https://via.placeholder.com/80'}
                alt="image product"
                preview={false}
              />
            </WrapperStyleColImage>
          ))}
        </Row>
      </Col>
      <Col span={14} style={{ paddingLeft: '10px' }}>
        <WrapperStyleNameProduct>{name}</WrapperStyleNameProduct>
        <div>
          {[...Array(rating || 5)].map((_, index) => (
            <StarFilled key={index} style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
          ))}
          <WrapperStyleTextSell>| Đã Bán {selled || 0}</WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>
            {price ? `${price.toLocaleString()} đ` : 'Liên hệ'}
          </WrapperPriceTextProduct>
        </WrapperPriceProduct>
        <WrapperAddressProduct>
          <span>Giao đến: </span>
          <span className="address">{userAddress || 'Địa chỉ mặc định'}</span>
        </WrapperAddressProduct>
        <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ marginBottom: '10px' }}>
            Số lượng (Trong kho: {countInStock || 0})
          </div>
          <WrapperQualityProduct>
            <button style={{ border: 'none', background: 'transparent' }} onClick={handleDecrease}>
              <MinusOutlined style={{ color: '#000', fontSize: '15px' }} />
            </button>
            <InputNumber
              value={quantity}
              onChange={handleInputChange}
              size="small"
              min={1}
              max={countInStock || 9999}
            />
            <button style={{ border: 'none', background: 'transparent' }} onClick={handleIncrease}>
              <PlusOutlined style={{ color: '#000', fontSize: '15px' }} />
            </button>
          </WrapperQualityProduct>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ButtonComponent
            size={20}
            styleButton={{
              background: 'rgb(255, 57,69)',
              height: '48px',
              width: '220px',
              borderRadius: '4px',
              border: 'none',
            }}
            textButton={'Chọn Mua'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          />
          <ButtonComponent
            size={20}
            styleButton={{
              background: '#fff',
              height: '48px',
              width: '220px',
              borderRadius: '4px',
              border: '1px solid rgb(13,92,182)',
            }}
            textButton={'Mua trả sau'}
            styleTextButton={{ color: 'rgb(13,92,182)', fontSize: '15px' }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ProductDetalilsComponent;
