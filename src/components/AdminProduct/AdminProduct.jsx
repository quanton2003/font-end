import React, { useEffect, useState } from 'react';
import { WrapperHeader } from './style';
import { Button, Form, message, Modal, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
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
const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [fileListCreate, setFileListCreate] = useState([]);
  const [fileListDetails, setFileListDetails] = useState([]);
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

  // ✅ Lấy danh sách sản phẩm
  const getAllProduct = async () => {
    try {
      const res = await ProductService.getAllProduct();
      return res?.data || []; // Tránh lỗi undefined
    } catch (error) {
      console.error('Lỗi khi fetch sản phẩm:', error);
      return [];
    }
  };

  const { isLoading: isLoadingProduct, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProduct,
    initialData: [],
  });

  // ✅ Lấy chi tiết sản phẩm
  const fetchGetDetailsProduct = async (rowSelected) => {
    if (!rowSelected) return;

    setIsLoadingUpdate(true);
    try {
      const res = await ProductService.getDetailsProduct(rowSelected);
      if (res?.data) {
        setStateProductDetails({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description,
          rating: res.data.rating,
          image: res.data.image,
          type: res.data.type,
          countInStock: res.data.countInStock,
        });
      }
    } catch (error) {
      console.error('❌ Lỗi khi gọi API:', error.response?.data || error.message);
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected) fetchGetDetailsProduct(rowSelected);
  }, [rowSelected]);

  useEffect(() => {
    if (formDetails && stateProductDetails) {
      formDetails.setFieldsValue(stateProductDetails);
    }
  }, [stateProductDetails]);

  // ✅ Tạo sản phẩm
  const mutation = useMutationHooks((data) => ProductService.createProduct(data));
  const { data, isLoading, isSuccess, isError } = mutation;

  // ✅ Cập nhật sản phẩm
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    return ProductService.updateProduct(id, token, rests);
  });
  

  const { data: dataUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate;

  // ✅ Xử lý khi chi tiết sản phẩm được chọn
  const handleDetailsProduct = () => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
      setIsOpenDrawer(true);
    }
  };
  // ✅ Xử lý cập nhật sản phẩm
  const onUpdateProduct = () => {
    if (!user?.access_token) {
      message.error('Bạn chưa đăng nhập!');
      return;
    }
    mutationUpdate.mutate({
      id: rowSelected,
      token: user?.access_token,
      ...stateProductDetails,
    });
  };
  const onFinish = () => {
    mutation.mutate(stateProduct);
  };
  // ✅ Cột bảng
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
    },
    { title: 'Price', dataIndex: 'price' },
    { title: 'Rating', dataIndex: 'rating' },
    { title: 'Type', dataIndex: 'type' },
    {
      title: 'Action',
      dataIndex: 'action',
      render: () => (
        <div>
          <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} />
          <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
        </div>
      ),
    },
  ];

  const dataTable = products?.map((product) => ({ ...product, key: product._id }));

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
      <Modal
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
      </Modal>
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
    </div>
  );
};

export default AdminProduct;
