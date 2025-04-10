import { Button, Result } from 'antd';
import React from 'react'
import { Link } from "react-router-dom";


const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #f0f5ff, #ffffff)",
        padding: "2rem",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
        extra={
          <Link to="/">
            <Button type="primary" size="large">
              Về trang chủ
            </Button>
          </Link>
        }
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          maxWidth: 500,
          width: "100%",
        }}
      />
    </div>
  )
}

export default NotFoundPage