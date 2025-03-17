import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLaber } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButttonComponent/ButttonComponent'
import * as UserService from '../../services/UserService';
import { useDispatch, useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHooks';
import * as massage from '../../components/Message/Message'
import { updateUser } from '../../redux/sides/userSlide';
import { Button, Upload } from 'antd';
import {UploadOutlined} from  '@ant-design/icons'
import { getBase64 } from '../../services/utils';
const ProfilePage = () => {
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')
  


  useEffect(() => {
    setName(user?.name)
    setEmail(user?.email)
    setPhone(user?.phone)
    setAddress(user?.address)
    setAvatar(user?.avatar)
  },[user])
  const mutation = useMutationHooks((data) => UserService.updateUser(data));
  const dispatch = useDispatch()
  const { data, isSuccess ,isError} = mutation; 
    useEffect(() => {
      if(isSuccess) {
        massage.success()
        handleGetDetailsUser(user?.id,user?.access_token)
      }else if(isError){
        massage.error()
      }

    },[isSuccess,isError])

    const handleGetDetailsUser = async (id, token) => {
      if (!id || !token) {
        console.error("ID hoặc token không hợp lệ:", { id, token });
        return;
      }
      try {
        const res = await UserService.getDetailsUser(id, token);
        if (res?.data) {
          dispatch(updateUser({ ...res.data, access_token: token }));
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", res);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API getDetailsUser:", error);
      }
    };
    
    

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnchangeName = (value) => {
    setName(value)
  }
  const handleOnchangePhone = (value) => {
    setPhone(value)
  }
  const handleOnchangeAddress = (value) => {
    setAddress(value)
  }
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]; // Lấy file đầu tiên
  
    if (file && file.originFileObj) {
      const preview = await getBase64(file.originFileObj);
      setAvatar(preview); // ✅ Cập nhật avatar với ảnh base64
    }
  };
  

  const handleUpdate = () => {
    const updatedData = { 
        id: user?.id, 
        email, 
        name, 
        phone, 
        address, 
        avatar ,
        access_token:user?.access_token
    };
    mutation.mutate(updatedData);

};

  
  return (
    <div style={{ width: '1270px', margin: '0 auto', height: '500px' }} >
        <WrapperHeader>Thông tin người dùng</WrapperHeader>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLaber htmlFor='email' >Email</WrapperLaber>
        <InputForm style={{ width:'300px' }} id='email' value={email} handleOnchange={handleOnchangeEmail} />
        <ButtonComponent
              onClick={handleUpdate}
              size={20}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: ' 4px 6px 6px',
              }}
              textButton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26,148,255)',fontSize:'10px',fontWeight:'700'}}
            />
        </WrapperInput>
        <WrapperInput>
            <WrapperLaber htmlFor='name' >Name</WrapperLaber>
        <InputForm style={{ width:'300px' }} id='name' value={name} handleOnchange={handleOnchangeName} />
        <ButtonComponent
              onClick={handleUpdate}
              size={20}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: ' 4px 6px 6px',
              }}
              textButton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26,148,255)',fontSize:'10px',fontWeight:'700'}}
            />
        </WrapperInput>
        <WrapperInput>
            <WrapperLaber htmlFor='phone' >Phone</WrapperLaber>
        <InputForm style={{ width:'300px' }} id='phone' value={phone} handleOnchange={handleOnchangePhone} />
        <ButtonComponent
              onClick={handleUpdate}
              size={20}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: ' 4px 6px 6px',
              }}
              textButton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26,148,255)',fontSize:'10px',fontWeight:'700'}}
            />
        </WrapperInput>
        <WrapperInput>
            <WrapperLaber htmlFor='address' >Address</WrapperLaber>
        <InputForm style={{ width:'300px' }} id='address' value={address} handleOnchange={handleOnchangeAddress} />
        <ButtonComponent
              onClick={handleUpdate}
              size={20}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: ' 4px 6px 6px',
              }}
              textButton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26,148,255)',fontSize:'10px',fontWeight:'700'}}
            />
        </WrapperInput>
        <WrapperInput>
            <WrapperLaber htmlFor='avatar' >Avatar</WrapperLaber>
            <Upload 
              listType="picture-card" 
              showUploadList={false} 
              beforeUpload={() => false} // Ngăn chặn upload ngay lập tức
              onChange={handleOnchangeAvatar} // ✅ Gọi đúng function
            >
                {avatar ? (
                  <img src={avatar} alt="avatar" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                ) : (
    <Button icon={<UploadOutlined />}>Tải ảnh</Button>
  )}
</Upload>


        {/* <InputForm style={{ width:'300px' }} id='avatar' value={avatar} handleOnchange={handleOnchangeAvatar} /> */}
        <ButtonComponent
              onClick={handleUpdate}
              size={20}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: ' 4px 6px 6px',
              }}
              textButton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26,148,255)',fontSize:'10px',fontWeight:'700'}}
            />
        </WrapperInput>
       
        </WrapperContentProfile>
        
    </div>
  )
}

export default ProfilePage