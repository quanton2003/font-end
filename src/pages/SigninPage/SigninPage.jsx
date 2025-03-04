import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButttonComponent/ButttonComponent'
import { Divider, Image } from 'antd'
import ImageLogo from '../../assets/Images/logologin.png';
import { EyeFilled,EyeInvisibleFilled } from '@ant-design/icons'
const SigninPage = () => {
    const[isShowPassword, setIsShowPassword] = useState(false);
    return (
        <div style={{ display: 'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.53)',height:'100vh' }} >
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff' , display: 'flex' }} >
                <WrapperContainerLeft>
                    <h1>Xin chào</h1>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <InputForm style={{ marginBottom:'10px' }} placeholder="quanvyyyb@gmail.com" />
                   <div style={{ position:'relative' }}>
                  <span
                  style={{ 
                    zIndex: 10,
                    position: 'absolute',
                      top: '4px',
                      right: '8px'
                   }}
                  >{
                    isShowPassword ? (
                        <EyeFilled style={{ fontSize:'15px' }} />
                    ):(
                        <EyeInvisibleFilled style={{ fontSize:'13px', alignItems:'center',marginTop:'5px' }} />
                    )
                  }
                  </span>
                   </div>
                    <InputForm placeholder="password" type={isShowPassword ? "text" : "password" }  />
                    <ButtonComponent
                        size={20}
                        styleButton={{
                            background: 'rgb(255, 57,69)',
                            height: '48px',
                            width: '100%',
                            borderRadius: '4px',
                            border: 'none',
                            margin: '26px 0 10px'
                        }}
                        textButton={'Đăng nhập'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    >
                    </ButtonComponent>
                    <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
                    <p>Chưa có tài khoản? <WrapperTextLight>Tạo tài khoản</WrapperTextLight></p> 

                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={ImageLogo} preview={false} alt='logo-image' height='203px' width='203px' />
                    <h4>Mua sắm tại đây</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SigninPage