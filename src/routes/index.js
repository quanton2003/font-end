import HomPages from "../pages/HomePage/HomPages";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import SigninPage from "../pages/SigninPage/SigninPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

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
    path: '/type',
    page: TypeProductPage,
    isShowHeader: true
  },
  {
    path: '/sign-in',
    page: SigninPage,
    isShowHeader: false
  },
  {
    path: '/sign-up',
    page: SignUpPage,
    isShowHeader: false
  },
  {
    path: '/product-details',
    page: ProductDetailsPage,
    isShowHeader: true
  },
  {
    path: '*',
    page: NotFoundPage
  },
];