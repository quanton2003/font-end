import { Col, Image, InputNumber, Radio, Row } from 'antd'
import imageProduct from '../../assets/Images/test.webp'
import imageProductSmall from '../../assets/Images/imagesmall1.webp'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'

import React from 'react'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import ButtonComponent from '../ButttonComponent/ButttonComponent'

const ProductDetalilsComponent = () => {
    const onChange = () => { };
    return (
        <Row style={{ padding: '16px', background: '#fff',borderRadius:'8px' }} >
            <Col span={10} style={{ borderRight:'1px solid #e5e5e5',paddingRight: '8px' }}  >
                <Image src={imageProduct} alt="image product" preview={false} />
                <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
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
            <Col span={14} style={{ paddingLeft:'10px' }} >
                <WrapperStyleNameProduct>Hồ Điệp Và Kình Ngư</WrapperStyleNameProduct>
                <div>
                    < StarFilled style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
                    < StarFilled style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
                    < StarFilled style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
                    < StarFilled style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
                    < StarFilled style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
                    <WrapperStyleTextSell>| Đã Bán 1000+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>200.000 Đ</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến</span>
                        <span className='address' >Nam Từ Niêm</span>-
                        <span className='change-address' >Đổi địa Chỉ</span>
                    </WrapperAddressProduct>
            
                <div style={{ margin: '10px 0 20px',padding: '10px 0', borderTop: '1px solid #e5e5e5',borderBottom: '1px solid #e5e5e5' }}>
                    <div style={{ marginBottom: '10px' }} >Số lượng</div>
                    <WrapperQualityProduct>   
                             <button style={{ border: 'none',background:'transparent' }} >
                            <MinusOutlined style={{ color: '#000', fontSize: '15px' }} />
                            </button>
                        <WrapperInputNumber defaultValue={3} onChange={onChange} size="small" />
                        <button style={{ border: 'none',background:'transparent' }} >
                            <PlusOutlined style={{ color: '#000', fontSize: '15px' }} />
                            </button>
                        </WrapperQualityProduct>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <ButtonComponent
                     size={20}
                     styleButton={{
                         background: 'rgb(255, 57,69)', 
                        height: '48px',
                        width:'220px',
                        borderRadius: '4px',
                        border: 'none',             
                        }}
                     textButton={'Chọn Mua'}
                     styleTextButton={{ color:'#fff', fontSize: '15px',fontWeight:'700' }}
                    >
                         </ButtonComponent>
                         <ButtonComponent
                     size={20}
                     styleButton={{
                         background: '#fff', 
                        height: '48px',
                        width:'220px',
                        borderRadius: '4px',
                        border: '1px solid rgb(13,92,182)',             
                        }}
                     textButton={'Mua trả sau'}
                     styleTextButton={{ color:'rgb(13,92,182)', fontSize:'15px' }}
                    >
                         </ButtonComponent>
                </div>
            </Col>
        </Row>
    )
}

export default ProductDetalilsComponent