import { Table } from 'antd';
import Loading from '../LoadingComponent/Loading';
import { useState } from 'react';

// import { Excel } from 'antd-table-saveas-excel';

const TableComponent = (props) => {
  const {
    selectionType = 'checkbox',
    data:dataSource = [],
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

  // const exportExcel =() => {
  //   const excel = new Excel();
  //   excel
  //   .addSheet('test')
  //   .addColums(columns)
  //   .addDataSource(dataSource,{
  //     str2Percent:true
  //   })
  //   .saveAs('Excel.xlsx')
  // }
  return (
    <div>
      <Loading isLoading={isLoading}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {rowSelectedKeys.length > 0 && (
            <>
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
              <button >Export Excel</button>
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
            </>
          )}
        </div>
        <Table
  rowSelection={{
    type: selectionType,
    ...rowSelection,
  }}
  columns={columns}
  dataSource={dataSource}
  pagination={props.pagination} // đảm bảo prop này được truyền xuống
  {...props}
/>
      </Loading>
    </div>
  );
};

export default TableComponent;
