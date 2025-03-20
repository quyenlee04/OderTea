import axios from 'axios';
import { API_URL } from '@/config';

class OrderService {
  createOrder(orderData) {
    return axios.post(`${API_URL}/orders`, orderData);
  }

  getOrderDetails(orderId) {
    return axios.get(`${API_URL}/orders/${orderId}`);
  }

  getUserOrders(userId) {
    return axios.get(`${API_URL}/orders/user/${userId}`);
  }
}

export default new OrderService();