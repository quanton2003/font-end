import { } from 'antd'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReporText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
const CardComponent = () => {
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
                Iphone
            </StyleNameProduct>
            <WrapperReporText>
                <span style={{ marginRight: '4px' }} >
                    <span> 4.96 </span>< StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                </span>
                <WrapperStyleTextSell>| Đã Bán 1000+</WrapperStyleTextSell>
            </WrapperReporText>
            <WrapperPriceText>
                <span style={{ marginRight:'8px' }} >1.000.000đ </span>
                <WrapperDiscountText>
                -5%
                </WrapperDiscountText> 
                </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent