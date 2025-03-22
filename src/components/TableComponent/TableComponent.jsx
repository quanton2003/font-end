import { Table } from 'antd';
import Loading from '../LoadingComponent/Loading';
import { useState } from 'react';

const TableComponent = (props) => {
  const {
    selectionType = 'checkbox',
    data = [],
    isLoading = false,
    columns = [],
    handleDeleteMany,
    handleDeleteManyUser,
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };

  const handleDeleteAll = () => {
    if (handleDeleteMany) {
      handleDeleteMany(rowSelectedKeys);
    }
  };

  const handleDeleteUsers = () => {
    if (handleDeleteManyUser) {
      handleDeleteManyUser(rowSelectedKeys);
    }
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        {rowSelectedKeys.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div
              style={{
                background: '#1d1ddd',
                color: '#fff',
                fontWeight: 'bold',
                padding: '10px',
                cursor: 'pointer',
              }}
              onClick={handleDeleteAll}
            >
              Xoá tất cả
            </div>
            {handleDeleteManyUser && (
              <div
                style={{
                  background: '#dd1d1d',
                  color: '#fff',
                  fontWeight: 'bold',
                  padding: '10px',
                  cursor: 'pointer',
                }}
                onClick={handleDeleteUsers}
              >
                Xoá user
              </div>
            )}
          </div>
        )}
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          {...props}
        />
      </Loading>
    </div>
  );
};

export default TableComponent;
