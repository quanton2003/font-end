import axios from 'axios';
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultCompoent from './components/DefaultCompoent/DefaultCompoent';
import { useQuery } from '@tanstack/react-query';

function App() {


  // useEffect(()=>{
  //   fetchApi()
  // },[])

  console.log('REACT_APP_API_URL',process.env.REACT_APP_API_URL)
  const fetchApi = async() => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`)
  return res.data
  }

  const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })

  console.log('query',query)
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
          const Page = route.page
          const Layout = route.isShowHeader ? DefaultCompoent : Fragment

          return (
            <Route key={route.path} path={route.path} element={
              <Layout>
            <Page />
            </Layout>
          } />  // This will render the component associated with the path.
          )
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;