import { Input } from 'antd';
import React, { useState } from 'react'

const InputForm = ({props}) => {
    const { valueInput, setValueInput } = useState('');
    // const {placeholder = 'Nhập text' } = props;
  return (
    <Input placeholder="Nhap" valueInput />
  )
}

export default InputForm