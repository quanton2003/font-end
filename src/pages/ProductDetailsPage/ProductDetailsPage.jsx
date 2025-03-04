import React from 'react'
import ProductDetalilsComponent from '../../components/ProductDetailsComponent/ProductDetalilsComponent'

const ProductDetailsPage = () => {
  return (
    <div style={{ padding: '0 120px',  background: '#efefef', height:'100px' }} >
        <h5>Trang Chủ</h5>
        <div>
      <ProductDetalilsComponent />
      </div>
    </div>
  )
}

export default ProductDetailsPage