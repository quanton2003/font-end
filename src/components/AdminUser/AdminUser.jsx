import React from 'react'
import { WrapperHeader } from './style'
import { Button } from 'antd'
import { PlusOutlined} from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'

const AdminUser = () => {
  return (
    <div>
        <WrapperHeader>Quản lý người dùng</WrapperHeader>
        <div style={{ marginTop:'10px' }} >
        <Button style={{ height:'150px',width:'150px' ,borderRadius:'16px',borderStyle:'dashed'}} ><PlusOutlined style={{ fontSize:'60px' }} /></Button>
        </div>
        <div style={{ marginTop:'20xp' }}>
        <TableComponent/>
        </div>
    </div>
  )
}

export default AdminUser