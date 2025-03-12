import { Spin } from "antd";
import React from "react";

const Loading = ({ children, isLoading = false }) => {
  
    return (
        <Spin spinning={isLoading} tip="Đang xử lý...">
            {children}
        </Spin>
    );
};

export default Loading;
