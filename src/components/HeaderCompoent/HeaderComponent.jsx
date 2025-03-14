import { Badge, Button, Col, Popover } from 'antd'
import React, { useState } from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
  CaretDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/sides/userSlide';
import Loading from '../LoadingComponent/Loading';
const HeaderComponent = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading,setloading] = useState(false)
  const handlaNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handlaLogOut = async () => {
    setloading(true);
    
    await UserService.logOutUser(); // Gọi API logout
    localStorage.removeItem('access_token'); // Xóa token trong localStorage
    dispatch(resetUser()); // Reset user trong Redux
    
    setloading(false);
  };
  

  const content = (
    <div>
      <WrapperContentPopup onClick={handlaLogOut} >Đăng Xuất</WrapperContentPopup>
      <WrapperContentPopup onClick={()=>navigate('/profile-user') } >Thông tin tài khoản</WrapperContentPopup>
    </div>
  );
  return (
    <div style={{ width: '100%', background: 'rgb(26,148,255)', display: 'flex', justifyContent: 'center' }} >
      <WrapperHeader gutter={16}>
        <Col span={5}>
          <WrapperTextHeader>QUANLAPTRINH</WrapperTextHeader>

        </Col>
        <Col span={13}>
          <ButtonInputSearch
            size="large"
            textButton="Tìm kiếm"
            bordered={false}
            placeholder="Tìm Kiếm"
            //    onSearch={onSearch} 
            enterButton /></Col>
        <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }} >
          <Loading isLoading={loading}>
          <WrapperHeaderAccout>
            <UserOutlined style={{ fontSize: '30px' }} />
            {user?.name ? (
              <>
               
                <Popover content={content} trigger="click">
                <div style={{ cursor: 'pointer' }} >{user.name}</div>
                </Popover>
              </>
            ) : (
              <div onClick={handlaNavigateLogin} style={{ cursor: 'pointer' }} >
                <WrapperTextHeaderSmall style={{ fontSize: '12px' }} >Đăng Nhập/Đăng Ký</WrapperTextHeaderSmall>
                <div>
                  <WrapperTextHeaderSmall style={{ fontSize: '12px' }} >Tài Khoản</WrapperTextHeaderSmall>
                  <CaretDownOutlined />
                </div>
              </div>
            )}

          </WrapperHeaderAccout>
          </Loading>
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