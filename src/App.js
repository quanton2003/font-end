import axios from 'axios';
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultCompoent from './components/DefaultCompoent/DefaultCompoent';
import { useQuery } from '@tanstack/react-query';
import { isJsonString } from './services/utils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService';
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/sides/userSlide';

function App() {
  const dispatch = useDispatch();

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  console.log('REACT_APP_API_URL', process.env.REACT_APP_API_URL);

  const fetchApi = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`);
    return res.data;
  };

  const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi });

  console.log('query', query);

  useEffect(() => {
    const { storageData, decodedToken } = handleDecoded();

    if (decodedToken?.id && storageData) {  // ✅ Kiểm tra token có tồn tại không
        handleGetDetailsUser(decodedToken?.id, storageData);
    }
}, []);


  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decodedToken = {};

    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decodedToken = jwtDecode(storageData);
    }

    return { decodedToken, storageData };
  };

  UserService.axiosJwt.interceptors.request.use(
    async (config) => {
        let { decodedToken, storageData } = handleDecoded();
        const currentTime = new Date().getTime() / 1000;

        if (decodedToken?.exp < currentTime) {
            try {
                const data = await UserService.refreshToken();

                // ✅ Lưu token mới vào localStorage
                localStorage.setItem('access_token', JSON.stringify(data.access_token));

                // ✅ Cập nhật Redux Store với token mới
                dispatch(updateUser({ access_token: data.access_token }));

                // ✅ Cập nhật token mới vào request
                config.headers['Authorization'] = `Bearer ${data.access_token}`;
            } catch (error) {
                console.error('Lỗi refresh token:', error);
                return Promise.reject(error);
            }
        } else {
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
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultCompoent : Fragment;

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
