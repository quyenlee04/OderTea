<template>
  <div v-if="cart.length === 0">
   <h1>Hãy thêm sản phẩm vào giỏ hàng</h1>
  </div>
  <div v-else class="modal-content">
    <table style="width: 100%" class="text-center table">
      <tr>
        <th>HÌNH</th>
        <th>SẢN PHẨM</th>
        <th>Đơn giá</th>
        <th>Số lượng</th>
        <th>Tiền</th>
        <th></th>
      </tr>
      <tr v-for="item in cart" :key="item.id">
        <td><img :src="`http://localhost:3000/${item.image_path}`" style="height: 100px; width: 100px" /></td>
        <td class="align-middle">{{ item.name }}</td>
        <td class="align-middle">{{ item.price }}</td>
        <td class="align-middle">
          <button @click="decreaseQuantity(item)">-</button>
          {{ item.quantity }}
          <button @click="increaseQuantity(item)">+</button>
        </td>
        <td class="align-middle">{{ item.price * item.quantity }}</td>
        <td class="align-middle">
          <button class="btn btn-danger" @click="deleteproduct(item)">Xoá</button>
        </td>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th>Tổng tiền</th>
        <th>{{ tongsoluong }}</th>
        <th>{{ tongtien }}</th>
         <th>
        <router-link to="/payment">
            <button class="btn btn-success">Thanh Toán </button>
        </router-link>
    </th>
        <th><button class="btn btn-danger" @click="xoahet()">Xóa hết : !</button></th>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      product: null,
    };
  },
  mounted() {
    const id = this.$route.params.id;
    this.fetchProduct(id);
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
     async fetchProduct(id) {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    },
    increaseQuantity(item) {
      const i = this.cart.find(i => i.id === item.id);
      if (item.quantity < i.quality) {
        item.quantity++;
        i.quality--;
        this.updateLocalStorage();
        this.updateProductQuantity(item.id, i.quality);
        
      }
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        const i = this.cart.find(i => i.id === item.id);
        item.quantity--;
        i.quality++;
        
        this.updateProductQuantity(item.id, i.quality);
        this.updateLocalStorage();
      } else {
        this.deleteproduct(item);
      }
    },
    deleteproduct(item) {
   
    this.cart = this.cart.filter(x => x.id !== item.id);
    this.updateProductQuantity(item.id, item.quality); 
    this.updateLocalStorage();
},
    xoahet() {
      this.cart.forEach(item => {
        this.updateProductQuantity(item.id, item.quality); 
      });
      this.cart = []; // Xóa hết giỏ hàng
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cart)); // Cập nhật giỏ hàng vào localStorage
    },
  updateProductQuantity(productId, newQuantity) {
    return axios.patch(`http://localhost:3000/products/${productId}`, { quality: newQuantity });
}
  },
};
</script>

<style>
.input {
    width: 40px; /* Điều chỉnh chiều rộng của ô nhập số lượng */
    text-align: center; /* Căn giữa nội dung bên trong ô nhập */
}
</style>