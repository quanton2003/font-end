import { Col, Image, Row } from 'antd'
import imageProduct from '../../assets/Images/test.webp'
import imageProductSmall from '../../assets/Images/imagesmall1.webp'
import React from 'react'
import { WrapperStyleColImage, WrapperStyleImageSmall } from './style'

const ProductDetalilsComponent = () => {
  return (
    <Row style={{ padding: '16px',background:'#fff' }} >
        <Col span={10} >
            <Image  src={imageProduct} alt="image product" preview={false} />
            <Row style={{ paddingTop: '10px', justifyContent:'space-between' }}>
                  <WrapperStyleColImage span={4} >
                  <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false} />
                  </WrapperStyleColImage>
                  <WrapperStyleColImage span={4} >
                  <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false} />
                  </WrapperStyleColImage>
                  <WrapperStyleColImage span={4} >
                  <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false} />
                  </WrapperStyleColImage>
                  <WrapperStyleColImage span={4} >
                  <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false} />
                  </WrapperStyleColImage>
                  <WrapperStyleColImage span={4} >
                  <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false} />
                  </WrapperStyleColImage>
                  <WrapperStyleColImage span={4} >
                  <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false} />
                  </WrapperStyleColImage>
            </Row>
        </Col>
        <Col span={14} >Coll12</Col>
    </Row>
  )
}

export default ProductDetalilsComponent