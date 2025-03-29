import React from 'react'
import ProductDetalilsComponent from '../../components/ProductDetailsComponent/ProductDetalilsComponent'
import { useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
  const {id} = useParams()
  return (
    <div style={{ padding: '0 120px',  background: '#efefef', height:'100px' }} >
        <h5>Trang Chủ - Chi Tiết sản phẩm </h5>
        <div>
      <ProductDetalilsComponent idProduct={id} />
      </div>
    </div>
  )
}

export default ProductDetailsPage