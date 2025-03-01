import { Col } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperTextHeader } from './style'
import Search from 'antd/es/transfer/search'
import {
    UserOutlined,
  } from '@ant-design/icons';

const HeaderComponent = () => {
  return (
    <div>
     <WrapperHeader>
      <Col span={6}>
      <WrapperTextHeader>QUANLAPTRINH</WrapperTextHeader>
 
      </Col>
      <Col span={12}>      <Search placeholder="input search text"
    //    onSearch={onSearch} 
       enterButton /></Col>
      <Col span={6}>
      <UserOutlined />
      </Col>
    </WrapperHeader>
    </div>
  )
}

export default HeaderComponent