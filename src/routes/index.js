import AdminPage from "../pages/AdminPage/AdminPage";
import HomPages from "../pages/HomePage/HomPages";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import SigninPage from "../pages/SigninPage/SigninPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import MyOrder from "../pages/MyOrder/MyOrder";
import OrderDetails from "../pages/OrderDetails/OrderDetails";

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
    path: '/payment',
    page: PaymentPage,
    isShowHeader: true
  },
  {
    path: '/order-details/:orderId',
    page: OrderDetails,
    isShowHeader: true
  },
  {
    path: '/my-order',
    page: MyOrder,
    isShowHeader: true
  },
  {
    path: '/orderDetails/:orderId',
    page: OrderDetails,
    isShowHeader: true
  },
  {
    path: 'product/:type',
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
    path: '/product-details/:id',
    page: ProductDetailsPage,
    isShowHeader: true
  },
  {
    path: '/profile-user',
    page: ProfilePage,
    isShowHeader: true
  },
  {
    path: "/system-admin", // ✅ Đảm bảo đây là string
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true,
  },
  {
    path: '*',
    page: NotFoundPage
  },
];