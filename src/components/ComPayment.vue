<template>
  <div class="payment-container">
    <h2>Thanh Toán</h2>
    <div v-if="!user">
      <p>Vui lòng đăng nhập để thanh toán.</p>
      <router-link to="/login">Đăng Nhập</router-link>
    </div>
    <div v-else>
      <div id="printableArea">
        <h3>Thông Tin Người Dùng</h3>
        <p>Tên: {{ user.fullname }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Địa Chỉ: {{ user.address }}</p>
        <h3>Thông Tin Đơn Hàng</h3>
        <table>
          <tr>
            <th>Sản Phẩm</th>
            <th>Số Lượng</th>
            <th>Đơn Giá</th>
            <th>Thành Tiền</th>
          </tr>
          <tr v-for="item in cart" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ formatCurrency(item.price * item.quantity) }}</td>
          </tr>
        </table>
        <h3>Tổng Số Lượng: {{ tongsoluong }}</h3>
        <h3>Tổng Tiền: {{ formatCurrency(tongtien) }}</h3>
      </div>
      <button @click="processPayment" class="payment-button">Xác Nhận Thanh Toán</button>
    </div>
  </div>
</template>

<script>

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export default {
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      user: JSON.parse(localStorage.getItem('currentuser')) || null,
      toast: useToast()
    };
  },
  computed: {
    tongtien() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    tongsoluong() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    },
    printInvoice() {
      const printContent = document.getElementById('printableArea').innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    },
    processPayment() {
      this.toast.success('Thanh toán thành công!', {
        position: 'top-right',
        duration: 3000,
        dismissible: true
      });

      
      this.printInvoice();
      localStorage.removeItem('cart');
      this.cart = [];
    }
  }
};
</script>

<style scoped>
.payment-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #c465b7;
  color: white;
  font-weight: 600;
}

.payment-button {
  background-color: #c465b7;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.payment-button:hover {
  background-color: #ad3d5d;
  transform: translateY(-2px);
}

@media print {
  .payment-button {
    display: none;
  }
  
  body {
    padding: 20px;
  }
  
  .payment-container {
    box-shadow: none;
  }
}
</style>
