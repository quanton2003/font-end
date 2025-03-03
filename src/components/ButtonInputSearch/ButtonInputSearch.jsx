import {  } from 'antd'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../inputComponent/inputComponent';
import ButtonComponent from '../ButttonComponent/ButttonComponent';
const ButtonInputSearch = (props) => {
    const {
        size,
        placeholder,
        textButton,
        bordered = true,
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(13,92,182)',
        colorButton = '#fff'
    } = props;

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            {/* Input - Vuông hơn */}
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{
                    backgroundColor: backgroundColorInput,
                    borderRadius: 0, // Bỏ bo góc
                }}
            />

            {/* Button - Vuông hơn */}
            <ButtonComponent
                size={size}
                style={{
                    background: backgroundColorButton,
                    color: colorButton,
                    borderRadius: 0, // Bỏ bo góc
                    border: !bordered ? 'none' : undefined
                }}
                icon={<SearchOutlined style={{ color: colorButton }} />}
            >
              <span> {textButton}</span>
            </ButtonComponent>
        </div>
    )
}

export default ButtonInputSearch;
