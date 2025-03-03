import { Input } from 'antd';
import React from 'react';

const InputComponent = ({ size, placeholder, bordered, style = {}, ...rests }) => {
  return (
    <Input
      size={size}
      placeholder={placeholder}
      bordered={bordered}
      style={style} // Truyền style đúng cách
      {...rests} // Tránh lỗi props
    />
  );
};

export default InputComponent;
