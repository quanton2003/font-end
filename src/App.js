import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import { Header } from 'antd/es/layout/layout';
import DefaultCompoent from './components/DefaultCompoent/DefaultCompoent';

function App() {
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