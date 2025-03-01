import HomPages from "../pages/HomePage/HomPages";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";

export const routes = [
  {
    path: '/',
    page: HomPages,
    isShowHeader: true
  },
  {
    path: '/orders',
    page: OrderPage,
    isShowHeader: true
  },
  {
    path: '/products',
    page: ProductsPage,
    isShowHeader: true
  },
  {
    path: '*',
    page: NotFoundPage
  },
];