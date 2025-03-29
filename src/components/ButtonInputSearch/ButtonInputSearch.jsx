import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../inputComponent/inputComponent';
import ButtonComponent from '../ButttonComponent/ButttonComponent';

const ButtonInputSearch = (props) => {
    const {
        size,
        placeholder,
        textButton,
        variant = 'outlined',
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(13,92,182)',
        colorButton = '#fff',
        onSearch,  // Nhận prop onSearch từ HeaderComponent
    } = props;

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            {/* Input - Truyền onSearch xuống InputComponent */}
            <InputComponent
                size={size}
                placeholder={placeholder}
                variant={variant}
                onChange={onSearch}  // Thêm sự kiện onChange để bắt giá trị nhập vào
                style={{
                    backgroundColor: backgroundColorInput,
                    borderRadius: 0,
                }}
            />

            {/* Button */}
            <ButtonComponent
                size={size}
                style={{
                    background: backgroundColorButton,
                    color: colorButton,
                    borderRadius: 0,
                    border: variant === 'borderless' ? 'none' : undefined
                }}
                icon={<SearchOutlined style={{ color: colorButton }} />}
            >
                <span>{textButton}</span>
            </ButtonComponent>
        </div>
    );
};


export default ButtonInputSearch;
