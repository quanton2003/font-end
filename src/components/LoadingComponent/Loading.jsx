import { Spin } from "antd";
import React from "react";

const Loading = ({ children, isLoading = false }) => {
  return (
    <Spin spinning={isLoading} tip="Đang xử lý...">
      {!isLoading ? children : null}
    </Spin>
  );
};

export default Loading;
