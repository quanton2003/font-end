import React from 'react';
import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReporText,
  WrapperStyleTextSell,
} from './style';
import { convertPrice } from '../../services/utils';

const CardComponent = (props) => {
  const {
    countInStock,
    description,
    image,
    name,
    price,
    rating,
    type,
    discount,
    selled,
    id,
  } = props;

  const navigate = useNavigate();

  // Thay vì gán lại navigate, ta gọi hàm navigate.
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <WrapperCardStyle
      hoverable
      styles={{
        header: { width: '200px', height: '200px' },
        body: { padding: '10px' },
      }}
      style={{ width: 200 }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailsProduct(id)}
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReporText>
        <span style={{ marginRight: '4px' }}>
          <span>{rating}</span>
          <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
        </span>
        <WrapperStyleTextSell>| Đã Bán {selled || 1000}</WrapperStyleTextSell>
      </WrapperReporText>
      <WrapperPriceText>
        <span style={{ marginRight: '8px' }}>
          {convertPrice(price)} 
        </span>
        <WrapperDiscountText>-{discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
