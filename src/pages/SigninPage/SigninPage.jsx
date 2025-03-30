import React, { useEffect, useState } from 'react';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButttonComponent/ButttonComponent';
import { Image, message } from 'antd';
import ImageLogo from '../../assets/Images/logologin.png';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHooks';
import Loading from '../../components/LoadingComponent/Loading';
import { jwtDecode } from "jwt-decode"; // ✅ Đúng cú pháp mới
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/sides/userSlide';

const SigninPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const location  = useLocation()
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Chỉ gọi useMutationHooks MỘT LẦN
  const { mutate, data, isLoading, isSuccess, } = useMutationHooks(UserService.loginUser);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      if(location?.state){
        navigate(location?.state)
      }else{
        navigate('/');
      }
      message.success("Đăng nhập thành công!");
      localStorage.setItem('access_token',JSON.stringify(data?.access_token)); // Đảm bảo dùng đúng key
      console.log("Token từ localStorage:", localStorage.getItem("token")); // Kiểm tra lại
      
      
      if (data?.access_token) {
        const decodedToken = jwtDecode(data?.access_token)
        console.log('decodedToken ', decodedToken);
        if (decodedToken?.id) {
          handleGetDetailsUser(decodedToken?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess, data]);
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data,access_token: token}))
  }

  const handleSignIn = () => {
    mutate({ email, password });
  };


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm placeholder="Email" value={email} handleOnchange={setEmail} style={{ marginBottom: '10px' }} />
          <div style={{ position: 'relative' }}>
            <InputForm placeholder="Mật khẩu" type={isShowPassword ? 'text' : 'password'} value={password} handleOnchange={setPassword} />
            <span onClick={() => setIsShowPassword((prev) => !prev)} style={{ position: 'absolute', top: '4px', right: '8px', cursor: 'pointer' }}>
              {isShowPassword ? <EyeFilled style={{ fontSize: '15px' }} /> : <EyeInvisibleFilled style={{ fontSize: '13px' }} />}
            </span>
          </div>

          {data?.status === 'ERR' && <span style={{ color: 'red', fontSize: "12px" }}>{data?.message}</span>}

          {/* ✅ Chỉ loading khi gọi API */}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              onClick={handleSignIn}
              size={20}
              styleButton={{
                background: !email || !password ? 'gray' : 'rgb(255, 57,69)',
                height: '48px',
                width: '100%',
                borderRadius: '4px',
                border: 'none',
                margin: '26px 0 10px',
                cursor: !email || !password ? 'not-allowed' : 'pointer'
              }}
              textButton={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              disabled={!email || !password || isLoading}
            />
          </Loading>





          <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          <p>Chưa có tài khoản? <WrapperTextLight onClick={() => navigate('/sign-up')}>Tạo tài khoản</WrapperTextLight></p>
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
