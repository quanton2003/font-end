import React, { useState } from 'react';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButttonComponent/ButttonComponent';
import { Image } from 'antd';
import ImageLogo from '../../assets/Images/logologin.png';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const SigninPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleOnchangeEmail = (value) => setEmail(value);
  const handleOnchangePassword = (value) => setPassword(value);
  const handleNavigateSignUp = () => {
    navigate('/sign-up');
  };

  const isButtonDisabled = !email.length || !password.length;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder="Email"
            value={email}
            handleOnchange={handleOnchangeEmail}
          />
          <div style={{ position: 'relative' }}>
            <InputForm
              placeholder="Mật khẩu"
              type={isShowPassword ? 'text' : 'password'}
              value={password}
              handleOnchange={handleOnchangePassword}
            />
            <span
              onClick={() => setIsShowPassword((prev) => !prev)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px',
                cursor: 'pointer'
              }}
            >
              {isShowPassword ? (
                <EyeFilled style={{ fontSize: '15px' }} />
              ) : (
                <EyeInvisibleFilled style={{ fontSize: '13px' }} />
              )}
            </span>
          </div>

          <ButtonComponent
            size={20}
            styleButton={{
              background: isButtonDisabled ? 'gray' : 'rgb(255, 57,69)',
              height: '48px',
              width: '100%',
              borderRadius: '4px',
              border: 'none',
              margin: '26px 0 10px',
              cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
            }}
            textButton={'Đăng nhập'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            disabled={isButtonDisabled}
          />

          <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          <p>
            Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={ImageLogo} preview={false} alt="logo-image" height="203px" width="203px" />
          <h4>Mua sắm tại đây</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SigninPage;
