import React from 'react';
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './style';
import { Checkbox, Rate } from 'antd';

const NavbarComponent = () => {
  const onChange = () => {};

  const renderContent = (type, options) => {
    switch (type) {
      case 'text':
        return options.map((option, index) => (
          <WrapperTextValue key={`text-${index}`}>{option}</WrapperTextValue>
        ));
      case 'checkbox':
        return (
          <Checkbox.Group
            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <Checkbox key={`checkbox-${index}`} style={{ marginLeft: 0 }} value={option.value}>
                {option.lable}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case 'star':
        return options.map((option) => (
           <div style={{ display: 'flex',gap:'9px',alignItems:'center' }}>
          <Rate style={ {fontsize:'12px'} } disabled defaultValue={option} />
          <span> {`Từ ${option} sao`}</span>
          </div>
        ));

        case 'price':
            return options.map((option ) => (
               
             <WrapperTextPrice  >{option}</WrapperTextPrice>
              
            ));

      default:
        return null;
    }
  };

  return (
    <div >
      <WrapperLableText>label</WrapperLableText>
      <WrapperContent>
        {renderContent('text', ['Tu lanh', 'TV', 'MayGiat'])}
      </WrapperContent>
    </div>
  );
};

export default NavbarComponent;
