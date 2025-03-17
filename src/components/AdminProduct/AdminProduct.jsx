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
const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: null,
    type: '',
    countInStock: '',
  });
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => ProductService.createProduct(data));

  const getAllProduct = async () => {
    try {
      const res = await ProductService.getAllProduct();
  
      return res?.data || []; // Đảm bảo trả về mảng
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm:", error);
      return []; // Tránh lỗi undefined
    }
  };
  
  
  const { data, isLoading, isSuccess, isError } = mutation;
  const { isLoading: isLoadingProduct, data: products } = useQuery({
    queryKey: ['products'],  
    queryFn: getAllProduct,  
    initialData: [], // Đảm bảo `products` có giá trị ban đầu
  });
  const renderAction = () =>{
    return(
      <div>
      <DeleteOutlined style={{ color:'red',fontSize:'30px',cursor:'pointer' }} />
      <EditOutlined style={{ color:'orange',fontSize:'30px',cursor:'pointer' }}/>
      </div>
    )
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
    },
    {
        title: 'Type',
        dataIndex: 'type',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: renderAction
      },
  ];
  const dataTable =products?.length && products?.map((products)=>{
    return {
        ...products,
        key: products._id
    }
  });

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      massage.success('Thành công');
      handleCancel(true);
    } else if (isError && data?.status === 'ERR') {
      massage.error('Thất bại');
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (stateProduct.image) {
      setFileList([{ uid: '-1', url: stateProduct.image }]);
    }
  }, [stateProduct.image]);

  const handleOnchangeAvatar = async ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.originFileObj) {
        const preview = await getBase64(file.originFileObj);
        setStateProduct((prev) => ({
          ...prev,
          image: preview,
        }));
      }
    }
  };

  const handleOnchange = (e) => {
    setStateProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onFinish = () => {
    mutation.mutate(stateProduct);
  };

  const handleCancel = (isSuccess = false) => {
    setIsModalOpen(false);
    if (isSuccess) {
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
      form.resetFields();
    }
  };


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
      <TableComponent columns={columns} isLoading={isLoadingProduct} data={dataTable} />


      </div>

      <Modal
        footer={null}
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={() => handleCancel(false)}
      >
        <Loading isLoading={isLoading}>
          <Form
            form={form}
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
                fileList={fileList}
                showUploadList={false}
                beforeUpload={() => false}
                maxCount={1}
                onChange={handleOnchangeAvatar}
              >
                {fileList.length > 0 ? (
                  <img src={fileList[0]?.thumbUrl || fileList[0]?.url} alt="product" style={{ width: '100%' }} />
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
    </div>
  );
};

export default AdminProduct;
