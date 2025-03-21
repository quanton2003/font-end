import React, { useEffect, useRef, useState } from 'react';
import { WrapperHeader } from './style';
import { Button, Form, message, Modal, Space, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../inputComponent/inputComponent';
import { getBase64 } from '../../services/utils';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from '../../hooks/useMutationHooks';
import Loading from '../LoadingComponent/Loading';
import * as massage from '../../components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import useSelection from 'antd/es/table/hooks/useSelection';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import ModalComponent from '../ModalComponent/ModalComponent';
const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [fileListCreate, setFileListCreate] = useState([]);
  const [fileListDetails, setFileListDetails] = useState([]);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const user = useSelector((state) => state?.user);
  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: null,
    type: '',
    countInStock: '',
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: null,
    type: '',
    countInStock: '',
  });

  const [fileList, setFileList] = useState([]);
  const [formCreate] = Form.useForm();
  const [formDetails] = Form.useForm();
  const queryClient = useQueryClient();
  // ✅ Lấy danh sách sản phẩm
  const getAllProduct = async () => {
    try {
      const res = await ProductService.getAllProduct();
      return res?.data || [];
    } catch (error) {
      console.error('Lỗi khi fetch sản phẩm:', error);
      return [];
    }
  };
  

  const queryProduct = useQuery({
    queryKey: ['products'],
    queryFn: getAllProduct,
    staleTime: 5000, // Giữ dữ liệu trong 5 giây trước khi fetch lại
  });
  const { isLoading: isLoadingProduct, data: products } = queryProduct
  

  // ✅ Lấy chi tiết sản phẩm
 const fetchGetDetailsProduct = async (rowSelected) => {
  if (!rowSelected) return;
  setIsLoadingUpdate(true);
  try {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        ...res.data,
      });
    }
  } catch (error) {
    console.error('❌ Lỗi khi gọi API:', error.response?.data || error.message);
  } finally {
    setIsLoadingUpdate(false);
  }
};
  useEffect(() => {
    if (formDetails && stateProductDetails) {
      formDetails.setFieldsValue(stateProductDetails);
    }
  }, [stateProductDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);
  // ✅ Tạo sản phẩm
  const mutation = useMutationHooks((data) => ProductService.createProduct(data),);
  const { data, isLoading, isSuccess, isError } = mutation;

  // ✅ Cập nhật sản phẩm
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token,...rests } = data;
    const res =  ProductService.updateProduct(id, token,{...rests})
    return res;
  })


  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res =  ProductService.deleteProduct(id, token)
    return res;
  })
  useEffect(() => {
    if (formDetails && stateProductDetails && Object.keys(stateProductDetails).length > 0) {
      formDetails.setFieldsValue(stateProductDetails);
    }
  }, );
  const { data: dataUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate;
  const {data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError:isErrorDeleted } = mutationDelete ;
  // ✅ Xử lý khi chi tiết sản phẩm được chọn
  const handleDetailsProduct = () => {
    if (rowSelected) {
      // fetchGetDetailsProduct(rowSelected);
      setIsOpenDrawer(true);
    }
  };
  // ✅ Xử lý cập nhật sản phẩm
  const latestToken = useSelector((state) => state?.user?.access_token); // Gọi bên ngoài

  const onUpdateProduct = () => {
    if (!latestToken) {
      message.error('Bạn chưa đăng nhập!');
      return;
    }
    mutationUpdate.mutate({
      id: rowSelected, // 🛑 Kiểm tra rowSelected có giá trị không?
      token: latestToken,
      ...stateProductDetails,
    },{
        onSettled: ()=>{
          queryProduct.refetch()
        }
    });
  };

  // ✅ Xử lý xóa sản phẩm
  const handleDeleteProduct = () => {
    if (!rowSelected) {
      console.error("🛑 Không có sản phẩm nào được chọn để xoá!");
      return;
    }
  
    mutationDelete.mutate(
      {
        id: rowSelected,
        token: latestToken,
      },
      {
        onSettled: () => {
          queryProduct.refetch()
          handleCancelDelete(true)
        },
      
      }
    );
  };
  
  
  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };
  

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });




  // ✅ Cột bảng
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter:(a,b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    { title: 'Price', dataIndex: 'price' ,
      sorter:(a,b) => a.name - b.name ,
      filters: [
        {
          text: '>= 50',
          value: '>=',
        },
        {
          text: '<= 50',
          value: '<=',
        },
      ],
      onFilter: (value, record) =>{
        if(value === '>='){
          return record.price >= 50;
        }
        else if(value === '<='){
          return record.price <= 50;
        }
      }
    },
    
    { title: 'Rating', dataIndex: 'rating',
      sorter:(a,b) => a.rating - b.rating ,
      filters: [
        {
          text: '>= 3',
          value: '>=',
        },
        {
          text: '<= 2',
          value: '<=',
        },
      ],
      onFilter: (value, record) =>{
        if(value === '>='){
          return record.rating >= 4;
        }
        else if(value === '<='){
          return record.rating <= 2;
        }
      }
     },
    { title: 'Type', dataIndex: 'type' },
    {
      title: 'Action',
      dataIndex: 'action',
      render: () => (
        <div>
          <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
          <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
        </div>
      ),
    },
  ];

  const dataTable = products?.map(({ _id, ...rest }) => ({ ...rest, key: _id })) || [];




  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      massage.success('Thành công');
      handleCancel(true);
    } else if (isError && data?.status === 'ERR') {
      massage.error('Thất bại');
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === 'OK') {
      massage.success('Thành công');
      setIsOpenDrawer(false)
    } else if (isErrorUpdate && dataUpdate?.status === 'ERR') {
      massage.error('Thất bại');
    }
  }, [isSuccessUpdate, isErrorUpdate]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      massage.success('Xoá Thành công');
      setIsOpenDrawer(false)
    } else if (isErrorDeleted && dataDeleted?.status === 'ERR') {
      massage.error('Thất bại');
    }
  }, [isSuccessDeleted, isErrorDeleted]);

  const handleCancelDelete = () =>{
    setIsModalOpenDelete(false);
  }
  const handleCancel = (reset = false) => {
    setIsModalOpen(false);
    if (reset) {
      setStateProduct({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: null,
        type: '',
        countInStock: '',
      });
      setFileList([]);
      formCreate.resetFields();
    }
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    setFileListCreate(fileList);
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.originFileObj) {
        const preview = await getBase64(file.originFileObj);
        setStateProduct((prev) => ({ ...prev, image: preview }));
      }
    }
  };
  

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    setFileListDetails(fileList);
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.originFileObj) {
        const preview = await getBase64(file.originFileObj);
        setStateProductDetails((prev) => ({ ...prev, image: preview }));
      }
    }
  };
  const handleOnchange = (e) => {
    setStateProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleOnchangeDetails = (e) => {
    setStateProductDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  console.log(stateProduct);
  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>

      <div style={{ marginTop: '10px' }}>
        <Button
          style={{
            height: '150px',
            width: '150px',
            borderRadius: '16px',
            borderStyle: 'dashed',
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: '60px' }} />
        </Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} isLoading={isLoadingProduct} data={dataTable} onRow={(record, rowIndex) => ({
          onClick: () => {
            if (record?._id) {
              setRowSelected(record._id);
            } else {
              console.warn("⚠ Không tìm thấy _id của sản phẩm!");
            }
          }
        })}

        />
      </div>
      <ModalComponent
        footer={null}
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={() => handleCancel(false)}
      >
        <Loading isLoading={isLoadingUpdate}>
          <Form
            form={formCreate}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            autoComplete="on"
          >
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <InputComponent value={stateProduct.name} name="name" onChange={handleOnchange} />
            </Form.Item>

            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Vui lòng nhập loại sản phẩm!' }]}>
              <InputComponent value={stateProduct.type} name="type" onChange={handleOnchange} />
            </Form.Item>

            <Form.Item label="CountInStock" name="countInStock" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
              <InputComponent value={stateProduct.countInStock} name="countInStock" onChange={handleOnchange} />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
              <InputComponent value={stateProduct.price} name="price" onChange={handleOnchange} />
            </Form.Item>

            <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}>
              <InputComponent value={stateProduct.rating} name="rating" onChange={handleOnchange} />
            </Form.Item>

            <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
              <InputComponent value={stateProduct.description} name="description" onChange={handleOnchange} />
            </Form.Item>

            {/* Upload Ảnh */}
            <Form.Item label="Upload Image" name="image">
              <Upload
                listType="picture-card"
                fileList={fileListCreate}
                showUploadList={false}
                beforeUpload={() => false}
                maxCount={1}
                onChange={handleOnchangeAvatar}
              >
                {fileListCreate.length > 0 ? (
                  <img src={fileListCreate[0]?.thumbUrl || fileListCreate[0]?.url} alt="product" style={{ width: '100%' }} />
                ) : stateProduct.image ? (
                  <img src={stateProduct.image} alt="product" style={{ width: '100%' }} />
                ) : (
                  <>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </>
                )}
              </Upload>
            </Form.Item>


            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%" >
        <Loading isLoading={isLoading}>
          <Form
            form={formDetails}
            name="update"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
          >
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <InputComponent value={stateProductDetails.name} name="name" onChange={handleOnchangeDetails} />
            </Form.Item>

            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Vui lòng nhập loại sản phẩm!' }]}>
              <InputComponent value={stateProductDetails.type} name="type" onChange={handleOnchangeDetails} />
            </Form.Item>

            <Form.Item label="CountInStock" name="countInStock" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
              <InputComponent value={stateProductDetails.countInStock} name="countInStock" onChange={handleOnchangeDetails} />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
              <InputComponent value={stateProductDetails.price} name="price" onChange={handleOnchangeDetails} />
            </Form.Item>

            <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}>
              <InputComponent value={stateProductDetails.rating} name="rating" onChange={handleOnchangeDetails} />
            </Form.Item>

            <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
              <InputComponent value={stateProductDetails.description} name="description" onChange={handleOnchangeDetails} />
            </Form.Item>

            {/* Upload Ảnh */}
            <Form.Item label="Upload Image" name="image">
              <Upload
                listType="picture-card"
                fileList={fileListDetails}
                showUploadList={false}
                beforeUpload={() => false}
                maxCount={1}
                onChange={handleOnchangeAvatarDetails}
              >
                {fileListDetails.length > 0 ? (
                  <img src={fileListDetails[0]?.thumbUrl || fileListDetails[0]?.url} alt="product" style={{ width: '100%' }} />
                ) : stateProductDetails.image ? (
                  <img src={stateProductDetails.image} alt="product" style={{ width: '100%' }} />
                ) : (
                  <>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </>
                )}
              </Upload>
            </Form.Item>


            <Form.Item>
              <Button type="primary" htmlType="submit">
              Update
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xoá sản phẩm"s
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
         <div>
          Bạn chắn chắn muốn xoá
         </div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
