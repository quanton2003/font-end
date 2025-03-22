import React, { useEffect, useState } from 'react';
import { WrapperHeader } from './style';
import { Button, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHooks';
import { useSelector } from 'react-redux';
import * as massage from '../../components/Message/Message';
const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState('');
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const latestToken = useSelector((state) => state?.user?.access_token);
  const queryClient = useQueryClient();

  // Hàm lấy danh sách user (thêm delay 1 giây để làm chậm)
  const getAllUser = async (token) => {
    if (!token) {
      console.error("🛑 Không có token!");
      return [];
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // delay 1 giây
      const res = await UserService.getAllUser(token);
      return res?.data || [];
    } catch (error) {
      console.error('❌ Lỗi khi fetch User:', error);
      return [];
    }
  };

      const queryUser = useQuery({
        queryKey: ['user'],
        queryFn: () => getAllUser(latestToken),
        enabled: !!latestToken,
        staleTime: 5000,
      });
      const { isLoading: isLoadingUser, data: users } = queryUser
  // Mutation xoá user
  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    return UserService.deleteUser(id, token);
  }, {
    onSuccess: () => {
      message.success('Xoá thành công');
      setIsModalOpenDelete(false);
      queryClient.invalidateQueries(['user']);
    },
    onError: () => {
      message.error('Xoá thất bại');
    },
  });

  const {data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError:isErrorDeletedMany } = mutationDelete ;

  const mutationDeleteMany = useMutationHooks((data) => {
    const {  token,...ids } = data;
    const res =  UserService.deleteManyUser(ids, token)
    return res;
  })

  const handleDeleteManyUser = (ids) =>{
    mutationDeleteMany.mutate(
      {
        id: ids,
        token: latestToken,
      },
      {
        onSettled: () => {
          queryUser.refetch()
        },
      
      }
    );
  }
  
  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      massage.success('Thành công');
    } else if (isErrorDeletedMany && dataDeletedMany?.status === 'ERR') {
      massage.error('Thất bại');
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany]);


  const handleCancelDelete = () =>{
    setIsModalOpenDelete(false);
  }
  const handleDeleteUser = () => {
    if (!rowSelected) {
      console.error("🛑 Không có user nào được chọn để xoá!");
      return;
    }
    mutationDelete.mutate(
      {
        id: rowSelected,
        token: latestToken,
      },
      {
        onSettled: () => {
          queryUser.refetch();
          handleCancelDelete(true);
        },
      }
    );
  };
  

  // Các cột của bảng
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <span>{text}</span>,
    },
    { 
      title: 'Email', 
      dataIndex: 'email' 
    },
    {
      title: 'isAdmin',
      dataIndex: 'isAdmin',
      render: (value) => (value ? 'true' : 'false'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
          onClick={() => {
            setRowSelected(record._id);
            setIsModalOpenDelete(true);
          }}
        />
      ),
    },
  ];

  const dataTable = users?.map(user => ({
    ...user,
    key: user._id, // đảm bảo _id được giữ lại
  })) || [];

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent 
        handleDeleteManyUser={handleDeleteManyUser}
          forceRender 
          columns={columns} 
          isLoading={isLoadingUser} 
          data={dataTable} 
          onRow={(record) => ({
            onClick: () => {
              if (record?._id) {
                setRowSelected(record._id);
              } else {
                console.warn("⚠ Không tìm thấy _id của user!");
              }
            }
          })}
        />
      </div>
      {isModalOpenDelete && (
        <ModalComponent
          title="Xác nhận xoá"
          open={isModalOpenDelete}
          onCancel={() => setIsModalOpenDelete(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpenDelete(false)}>
              Huỷ
            </Button>,
            <Button key="delete" type="primary" onClick={handleDeleteUser}>
              Xoá
            </Button>,
          ]}
        >
          <p>Bạn có chắc chắn muốn xoá user này không?</p>
        </ModalComponent>
      )}
    </div>
  );
};

export default AdminUser;
