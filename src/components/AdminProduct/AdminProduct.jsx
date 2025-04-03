import React, { useEffect, useRef, useState } from 'react';
import { WrapperHeader } from './style';
import { Button, Form, message, Upload, Space, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../inputComponent/inputComponent';
import { getBase64, renderOptions } from '../../services/utils';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from '../../hooks/useMutationHooks';
import Loading from '../LoadingComponent/Loading';
import * as massage from '../../components/Message/Message';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import { useSelector } from 'react-redux';

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [fileListCreate, setFileListCreate] = useState([]);
  const [fileListDetails, setFileListDetails] = useState([]);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [typeSelect, setTypeSelect] = useState('');
  const [currentPage, setCurrentPage] = useState(100);
  const [pageSize, setPageSize] = useState(100);
  const [totalProducts, setTotalProducts] = useState(0);
  const searchInput = useRef(null);
  const latestToken = useSelector((state) => state?.user?.access_token);

  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: null,
    type: '',
    countInStock: '',
    newType: '',
    discount: '',
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: null,
    type: '',
    countInStock: '',
    discount: '',
  });

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res
  }
  const [formCreate] = Form.useForm();
  const [formDetails] = Form.useForm();
  const queryClient = useQueryClient();
  const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
  const getAllProductForAdmin = async () => {
    try {
      // Gọi API mà không truyền limit để lấy toàn bộ sản phẩm
      const res = await ProductService.getAllProductForAdmin('');
      // Giả sử API trả về một mảng sản phẩm trong res.data
      const allProducts = res.data || [];
      // Set tổng số sản phẩm dựa vào độ dài mảng
      setTotalProducts(allProducts.length);
      return allProducts;
    } catch (error) {
      console.error('Lỗi khi fetch sản phẩm:', error);
      return [];
    }
  };






  const queryProduct = useQuery({
    queryKey: ['products', currentPage, pageSize],
    queryFn: () => ProductService.getAllProduct('', currentPage, pageSize),
    staleTime: 5000,
  });

  const { isLoading: isLoadingProduct, data: result } = queryProduct;
  const products = result?.data || [];
  // const totalProducts = result?.total || 0;
  const dataTable = products.map(product => ({
    ...product,
    key: product._id,
  }));

  const fetchGetDetailsProduct = async (rowId) => {
    if (!rowId) return;
    setIsLoadingUpdate(true);
    try {
      const res = await ProductService.getDetailsProduct(rowId);
      if (res?.data) {
        setStateProductDetails({ ...res.data });
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.response?.data || error.message);
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (stateProductDetails && formDetails) {
      formDetails.setFieldsValue(stateProductDetails);
    }
  }, [stateProductDetails, formDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  const mutationCreate = useMutationHooks((data) => ProductService.createProduct(data));
  const { data, isLoading, isSuccess, isError } = mutationCreate;

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    return ProductService.updateProduct(id, token, { ...rests });
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    return ProductService.deleteProduct(id, token);
  });

  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    return ProductService.deleteManyProduct(ids, token);
  });

  const { data: dataUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate;
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany;

  const handleDetailsProduct = () => {
    if (rowSelected) {
      setIsOpenDrawer(true);
    }
  };

  const onUpdateProduct = () => {
    if (!latestToken) {
      message.error('Bạn chưa đăng nhập!');
      return;
    }
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: latestToken,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleDeleteProduct = () => {
    if (!rowSelected) {
      console.error('Không có sản phẩm nào được chọn để xoá!');
      return;
    }
    mutationDelete.mutate(
      {
        id: rowSelected,
        token: latestToken,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
          handleCancelDelete();
        },
      }
    );
  };
  const onFinish = () => {
    const params ={
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type ==='add_type'?stateProduct.newType :stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    }
    mutationCreate.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        { text: '>= 50', value: '>=' },
        { text: '<= 50', value: '<=' },
      ],
      onFilter: (value, record) => {
        if (value === '>=') return record.price >= 50;
        if (value === '<=') return record.price <= 50;
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        { text: '>= 3', value: '>=' },
        { text: '<= 2', value: '<=' },
      ],
      onFilter: (value, record) => {
        if (value === '>=') return record.rating >= 4;
        if (value === '<=') return record.rating <= 2;
      },
    },
    { title: 'Type', dataIndex: 'type' },
    {
      title: 'Action',
      dataIndex: 'action',
      render: () => (
        <div>
          <DeleteOutlined style={{ color: 'red', fontSize: 30, cursor: 'pointer', marginRight: 12 }} onClick={() => setIsModalOpenDelete(true)} />
          <EditOutlined style={{ color: 'orange', fontSize: 30, cursor: 'pointer' }} onClick={handleDetailsProduct} />
        </div>
      ),
    },
  ];




  const handleDeleteMany = (ids) => {
    mutationDeleteMany.mutate(
      { id: ids, token: latestToken },
      { onSettled: () => queryProduct.refetch() }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

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
        discount: '',
      });
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
    setStateProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    })

  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      massage.success('Thành công');
      handleCancel(true);
    } else if (isError && data?.status === 'ERR') {
      massage.error('Thất bại');
    }
  }, [isSuccess, isError, data]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      massage.success('Xóa thành công');
    } else if (isErrorDeletedMany && dataDeletedMany?.status === 'ERR') {
      massage.error('Xóa thất bại');
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany]);

  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === 'OK') {
      massage.success('Cập nhật thành công');
      setIsOpenDrawer(false);
    } else if (isErrorUpdate && dataUpdate?.status === 'ERR') {
      massage.error('Cập nhật thất bại');
    }
  }, [isSuccessUpdate, isErrorUpdate, dataUpdate]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      massage.success('Xóa thành công');
      setIsOpenDrawer(false);
    } else if (isErrorDeleted && dataDeleted?.status === 'ERR') {
      massage.error('Xóa thất bại');
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted]);



  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: 10 }}>
        <Button
          style={{ height: 150, width: 150, borderRadius: 16, borderStyle: 'dashed' }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: 60 }} />
        </Button>
      </div>
      <div style={{ marginTop: 20 }}>
        <TableComponent
          handleDeleteMany={handleDeleteMany}
          forceRender
          columns={columns}
          isLoading={isLoadingProduct}
          data={dataTable} // dữ liệu của trang hiện tại được trả về từ backend
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalProducts,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
          onRow={(record) => ({
            onClick: () => {
              if (record?._id) {
                setRowSelected(record._id);
              } else {
                console.warn('Không tìm thấy _id của sản phẩm!');
              }
            },
          })}
        />


      </div>
      <ModalComponent
        forceRender
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
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <Select
                name="type"
                value={stateProduct.type}
                onChange={handleSelectChange}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>

            {stateProduct.type === 'add_type' && (
              <Form.Item
                label="New Type"
                name="newType"
                rules={[{ required: true, message: 'Please input your type!' }]}
              >
             
                  <InputComponent
                    value={stateProduct.newType}
                    onChange={handleOnchange}
                    name="newType"
                  />
    
              </Form.Item>
            )}



            <Form.Item label="CountInStock" name="countInStock" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
              <InputComponent value={stateProduct.countInStock} name="countInStock" onChange={handleOnchange} />
            </Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
              <InputComponent value={stateProduct.price} name="price" onChange={handleOnchange} />
            </Form.Item>
            <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}>
              <InputComponent value={stateProduct.rating} name="rating" onChange={handleOnchange} />
            </Form.Item>
            <Form.Item label="Discount" name="discount" rules={[{ required: true, message: 'Vui lòng nhập Giảm giá!' }]}>
              <InputComponent value={stateProduct.discount} name="discount" onChange={handleOnchange} />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
              <InputComponent value={stateProduct.description} name="description" onChange={handleOnchange} />
            </Form.Item>
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
                Tạo
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent forceRender title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
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
            <Form.Item label="discount" name="discount" rules={[{ required: true, message: 'Vui lòng nhập discount!' }]}>
              <InputComponent value={stateProductDetails.discount} name="discount" onChange={handleOnchangeDetails} />
            </Form.Item>
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
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent forceRender title="Xoá sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn chắc chắn muốn xoá?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
