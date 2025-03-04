import { } from 'antd'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReporText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
const CardComponent = () => {
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '200px'}}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <StyleNameProduct>
                Iphone
            </StyleNameProduct>
            <WrapperReporText>
                <span style={{ marginRight: '4px' }} >
                    <span> 4.96 </span>< StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                </span>
                <WrapperStyleTextSell>| Đã Bán 1000+</WrapperStyleTextSell>
            </WrapperReporText>
            <WrapperPriceText>1.000.000đ 
                <WrapperDiscountText>
                -5%
                </WrapperDiscountText> 
                </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent