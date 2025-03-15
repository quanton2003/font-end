import { } from 'antd'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReporText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
const CardComponent = (props) => {
    const{countInStock,description,image,name,price,rating,type,discount,selled} = props 
    return (
<WrapperCardStyle
    hoverable
    styles={{
        header: { width: '200px', height: '200px' },  
        body: { padding: '10px' } 
    }}
    style={{ width: 200 }}
    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
>

            <StyleNameProduct>
             {name}
            </StyleNameProduct>
            <WrapperReporText>
                <span style={{ marginRight: '4px' }} >
                    <span> {rating} </span>< StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                </span>
                <WrapperStyleTextSell>| Đã Bán {selled ||1000 }</WrapperStyleTextSell>
            </WrapperReporText>
            <WrapperPriceText>
                <span style={{ marginRight:'8px' }} >{price}</span>
                <WrapperDiscountText>
                {discount||5}%
                </WrapperDiscountText> 
                </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent