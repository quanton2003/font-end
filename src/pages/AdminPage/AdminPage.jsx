import { Menu, Button } from 'antd';
import React, { useState, Suspense } from 'react';
import {
  AppstoreOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderCompoent/HeaderComponent';
import { getItem } from '../../services/utils';

const AdminUser = React.lazy(() => import('../../components/AdminUser/AdminUser'));
const AdminProduct = React.lazy(() => import('../../components/AdminProduct/AdminProduct'));
const AdminOrder = React.lazy(() => import('../../components/AdminOrder/AdminOrder'));

const AdminPage = () => {
  const [keySelected, setKeySelected] = useState('user');
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    getItem('Người dùng', 'user', <UserOutlined />),
    getItem('Sản phẩm', 'product', <AppstoreOutlined />),
    getItem('Đơn hàng', 'order', <AppstoreOutlined />),
  ];

  const renderPage = {
    user: <AdminUser />,
    product: <AdminProduct />,
    order: <AdminOrder />,
  };

  return (
    <>
      <HeaderComponent isHidenSearch isHidenCart />
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <div style={{ position: 'relative' }}>
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[keySelected]}
            style={{
              width: collapsed ? 80 : 256,
              height: '100%',
              boxShadow: '1px 1px 2px #ccc',
              transition: 'width 0.2s',
            }}
            items={items}
            onClick={({ key }) => setKeySelected(key)}
          />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute',
              top: '50%',
              right: -40,
              transform: 'translateY(-50%)',
            }}
          />
        </div>
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <h2 style={{ marginBottom: 20 }}>
            {keySelected === 'user' && 'Quản lý người dùng'}
            {keySelected === 'product' && 'Quản lý sản phẩm'}
            {keySelected === 'order' && 'Quản lý đơn hàng'}
          </h2>
          <Suspense fallback={<div>Đang tải...</div>}>
            {renderPage[keySelected]}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
