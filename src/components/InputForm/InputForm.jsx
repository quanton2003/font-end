import React from 'react';
import { WrapperIputStyle } from './style';

const InputForm = (props) => {
    const { placeholder = 'Nhập text', handleOnchange, ...rests } = props;

    const handleOnchageInput = (e) => {
        if (typeof handleOnchange === 'function') { // 🔥 Kiểm tra nếu handleOnchange tồn tại
            handleOnchange(e.target.value);
          
        }
    };

    return (
        <WrapperIputStyle
            placeholder={placeholder}
            value={props.value} 
            {...rests}
            onChange={handleOnchageInput}
        />
    );
};

export default InputForm;
