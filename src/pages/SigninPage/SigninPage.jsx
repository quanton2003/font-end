import React from 'react'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButttonComponent/ButttonComponent'
import { Image } from 'antd'
import ImageLogo from '../../assets/Images/logologin.png';

const SigninPage = () => {
    return (
        <div style={{ display: 'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.53)',height:'100vh' }} >
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff' }} >
                <WrapperContainerLeft>
                    <h1>Xin chào</h1>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <InputForm />
                    <ButtonComponent
                        size={20}
                        styleButton={{
                            background: 'rgb(255, 57,69)',
                            height: '48px',
                            width: '220px',
                            borderRadius: '4px',
                            border: 'none',
                        }}
                        textButton={'Đăng nhập'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    >
                    </ButtonComponent>

                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={ImageLogo} preview={false} alt='logo-image' height='203px' width='203px' />
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SigninPage