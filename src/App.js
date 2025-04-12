// App.js
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { routes } from './routes';
import DefaultCompoent from './components/DefaultCompoent/DefaultCompoent';
import { useQuery } from '@tanstack/react-query';
import { isJsonString } from './services/utils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, resetUser } from './redux/sides/userSlide';
import Loading from './components/LoadingComponent/Loading';

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Khởi tạo là true để hiển thị loading ban đầu
  const user = useSelector((state) => state.user);

  const fetchApi = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`);
    return res.data;
  };

  const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi });

  useEffect(() => {
    const { storageData, decodedToken } = handleDecoded();
    if (decodedToken?.id && storageData) {
      handleGetDetailsUser(decodedToken?.id);
    } else {
      setIsLoading(false); // Nếu không có token hợp lệ, tắt loading
    }
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decodedToken = {};

    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      try {
        decodedToken = jwtDecode(storageData);
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        localStorage.removeItem('access_token'); // Xóa token lỗi
        storageData = null;
      }
    }

    return { decodedToken, storageData };
  };

  const handleGetDetailsUser = async (id) => {
    const storage = localStorage.getItem('refresh_token');
    let refreshToken = null;

    if (storage && storage !== "undefined") {
      try {
        refreshToken = JSON.parse(storage);
      } catch (error) {
        console.error("Lỗi khi parse refresh_token:", error);
        localStorage.removeItem('refresh_token');
      }
    }

    try {
      const res = await UserService.getDetailsUser(id);
      if (res?.data) {
        dispatch(updateUser({ ...res.data, refreshToken: refreshToken }));
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết người dùng:", error);
      // Xử lý lỗi ở đây, ví dụ: chuyển hướng người dùng đến trang đăng nhập nếu lỗi 401/403
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(resetUser());
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Chuyển hướng đến trang đăng nhập (sử dụng useNavigate hook bên trong component con nếu cần)
        // Hoặc bạn có thể set một state để hiển thị thông báo lỗi và nút đăng nhập lại
      }
    } finally {
      setIsLoading(false);
    }
  };

  UserService.axiosJwt.interceptors.request.use(
    async (config) => {
      let { decodedToken, storageData } = handleDecoded();
      const currentTime = new Date().getTime() / 1000;

      if (decodedToken?.exp < currentTime && storageData) {
        try {
          const data = await UserService.refreshToken();
          if (data?.access_token) {
            localStorage.setItem('access_token', JSON.stringify(data.access_token));
            if (data?.refreshToken) {
              localStorage.setItem('refresh_token', JSON.stringify(data.refreshToken));
            }
            dispatch(updateUser({ access_token: data.access_token }));
            config.headers['Authorization'] = `Bearer ${data.access_token}`;
          } else {
            // Xử lý trường hợp không nhận được token mới (ví dụ: refresh token hết hạn)
            dispatch(resetUser());
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Chuyển hướng đến trang đăng nhập
          }
        } catch (error) {
          console.error('Lỗi refresh token:', error);
          dispatch(resetUser());
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Chuyển hướng đến trang đăng nhập
          return Promise.reject(error);
        }
      } else if (storageData) {
        config.headers['Authorization'] = `Bearer ${storageData}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return (
    <div>
      {isLoading ? <Loading /> : (
        <Router>
          <Routes>
            {routes
              .filter((route) => typeof route.path === "string")
              .map((route) => {
                if (!route.path) return null;

                const Page = route.page;
                const ischeckAuth = !route.isPrivate || user.isAdmin;
                const Layout = route.isShowHeader ? DefaultCompoent : Fragment;

                return ischeckAuth ? (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                ) : null;
              })}
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;