import { Badge, Col } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
  CaretDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';

const HeaderComponent = () => {
  return (
    <div>
      <WrapperHeader gutter={16}>
        <Col span={6}>
          <WrapperTextHeader>QUANLAPTRINH</WrapperTextHeader>

        </Col>
        <Col span={12}>
          <ButtonInputSearch
            size="large"
            textButton="Tìm kiếm"
            bordered ={false}
            placeholder="Tìm Kiếm"
            //    onSearch={onSearch} 
            enterButton /></Col>
        <Col span={6} style={{ display: 'flex', gap: '20px', alignItems: 'center' }} >
          <WrapperHeaderAccout>
            <UserOutlined style={{ fontSize: '30px' }} />
            <div>
              <WrapperTextHeaderSmall style={{ fontSize: '12px' }} >Đăng Nhập/Đăng Ký</WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall style={{ fontSize: '12px' }} >Tài Khoản</WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
          </WrapperHeaderAccout>
          <div>
            <Badge count={4} size='small' >
            <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />

            </Badge>
            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent