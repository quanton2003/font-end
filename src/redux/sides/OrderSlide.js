import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orderItems: [],
  shippingAddress: {},
  paymentMethod: '',
  itemPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totaPrice: 0,
  user: '',
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  delivereAt: ''
}

export const OrderSlide = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItems } = action.payload;
      const itemOrder = state.orderItems.find(
        (item) => item.product === orderItems.product
      );
      if (itemOrder) {
        itemOrder.amount += orderItems.amount;
      } else {
        state.orderItems.push(orderItems);
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state.orderItems.find(
        (item) => item.product === idProduct
      );
      if (itemOrder) {
        itemOrder.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state.orderItems.find(
        (item) => item.product === idProduct
      );
      if (itemOrder && itemOrder.amount > 1) {
        itemOrder.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      state.orderItems = state.orderItems.filter(
        (item) => item.product !== idProduct
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
} = OrderSlide.actions;

export default OrderSlide.reducer;
