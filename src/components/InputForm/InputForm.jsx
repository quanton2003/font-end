
import React, { useState } from 'react'
import { WrapperIputStyle } from './style';

const InputForm = (props) => {
    const { valueInput, setValueInput } = useState('');
    const {placeholder = 'Nhập text',...rests } = props;
  return (
  
    <WrapperIputStyle placeholder={placeholder} valueInput={valueInput} {...rests}  />
    
  )
}

export default InputForm