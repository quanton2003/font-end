import React, { useEffect, useState } from 'react';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButttonComponent/ButttonComponent';
import { Image, message } from 'antd';
import ImageLogo from '../../assets/Images/logologin.png';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHooks';
import Loading from '../../components/LoadingComponent/Loading';
import * as massage from '../../components/Message/Message'
const SignUpPage = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleOnchangeEmail = (value) => setEmail(value);
  const handleOnchangePassword = (value) => setPassword(value);
  const handleOnchangeConfirmPassword = (value) => setConfirmPassword(value);
  const { mutate, data, isLoading, isSuccess, isError } = useMutationHooks(UserService.signupUser);
  useEffect(() => {
    if (isSuccess && data?.status === "OK") { 
      message.success("Đăng ký thành công!");
      handleNavigateSignIn();
    } else if (isError || data?.status === "ERR") {
      message.error(data?.message || "Đăng ký thất bại!");
    }
  }, [isSuccess, isError, data]);
  


  const handleNavigateSignIn = () => {
    navigate('/sign-in');
  };

  const handleSignUp = () => {
    mutate({ email, password, confirmPassword });
    console.log('sign-up', email, password, confirmPassword);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.53)',
        height: '100vh',
      }}
    >
      <div
        style={{
          width: '800px',
          height: '445px',
          borderRadius: '6px',
          background: '#fff',
          display: 'flex',
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>

          {/* Email Input */}
          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder="Email"
            value={email}
            handleOnchange={handleOnchangeEmail}
          />

          {/* Password Input */}
          <div style={{ position: 'relative' }}>
            <InputForm
              type={isShowPassword ? 'text' : 'password'}
              style={{ marginBottom: '10px' }}
              placeholder="Mật khẩu"
              value={password} // 🔥 Đặt `value` đúng chỗ
              handleOnchange={handleOnchangePassword} // 🔥 Đặt `handleOnchange` đúng chỗ
            />
            <span
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? (
                <EyeFilled style={{ fontSize: '15px' }} />
              ) : (
                <EyeInvisibleFilled style={{ fontSize: '15px' }} />
              )}
            </span>
          </div>

          {/* Confirm Password Input */}
          <div style={{ position: 'relative' }}>
            <InputForm
              type={isShowConfirmPassword ? 'text' : 'password'}
              style={{ marginBottom: '10px' }}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword} // 🔥 Đặt `value` đúng chỗ
              handleOnchange={handleOnchangeConfirmPassword} // 🔥 Đặt `handleOnchange` đúng chỗ
            />
            <span
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            >
              {isShowConfirmPassword ? (
                <EyeFilled style={{ fontSize: '15px' }} />
              ) : (
                <EyeInvisibleFilled style={{ fontSize: '15px' }} />
              )}
            </span>
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red', fontSize: "12px" }}>{data?.message}</span>}
          <Loading isLoading={isLoading} >
            <ButtonComponent
              onClick={handleSignUp} // 🔥 Đổi từ `handlaSignUp` thành `handleSignUp`
              size={20}
              styleButton={{
                background: 'rgb(255, 57,69)',
                height: '48px',
                width: '100%',
                borderRadius: '4px',
                border: 'none',
                margin: '26px 0 10px',
              }}
              textButton={'Đăng Kí'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            />     </Loading>

          <p>
            Chưa có tài khoản?{' '}
            <WrapperTextLight onClick={handleNavigateSignIn}>Đăng Nhập</WrapperTextLight>
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

export default SignUpPage;
