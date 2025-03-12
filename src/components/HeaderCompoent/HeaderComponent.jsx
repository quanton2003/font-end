import { Badge, Col } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
  CaretDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import useSelection from 'antd/es/table/hooks/useSelection';
import { useSelector } from 'react-redux';

const HeaderComponent = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const handlaNavigateLogin =() =>{
     navigate('/sign-in')
  }
  console.log('user',user)
  return (
    <div style={{ width: '100%' , background:'rgb(26,148,255)', display:'flex', justifyContent:'center' }} >
      <WrapperHeader gutter={16}>
        <Col span={5}>
          <WrapperTextHeader>QUANLAPTRINH</WrapperTextHeader>

        </Col>
        <Col span={13}>
          <ButtonInputSearch
            size="large"
            textButton="Tìm kiếm"
            bordered ={false}
            placeholder="Tìm Kiếm"
            //    onSearch={onSearch} 
            enterButton /></Col>
        <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }} >
          <WrapperHeaderAccout>
            <UserOutlined style={{ fontSize: '30px' }} />
            {user?.name ? (
              <div style={{ cursor: 'pointer' }} >{user.name}</div>
            ):(
              <div onClick={handlaNavigateLogin} style={{ cursor: 'pointer' }} >
              <WrapperTextHeaderSmall style={{ fontSize: '12px' }} >Đăng Nhập/Đăng Ký</WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall style={{ fontSize: '12px' }} >Tài Khoản</WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
            )}

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