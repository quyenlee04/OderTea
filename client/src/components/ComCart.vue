<template>
  <div v-if="cart.length === 0" class="empty-cart">
    <h1>Hãy thêm sản phẩm vào giỏ hàng</h1>
    <router-link to="/" class="continue-shopping">Tiếp tục mua sắm</router-link>
      
  </div>
  <div v-else class="cart-container">
    <h2>Giỏ hàng của bạn</h2>
    <table class="cart-table">
      <thead>
        <tr>
          <th>HÌNH</th>
          <th>SẢN PHẨM</th>
          <th>Đơn giá</th>
          <th>Số lượng</th>
          <th>Tiền</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cart" :key="item.id">
          <td><img :src="`http://localhost:3000/${item.image_path}`" class="product-image" /></td>
          <td class="align-middle">{{ item.name }}</td>
          <td class="align-middle">{{ formatPrice(item.price) }}</td>
          <td class="align-middle quantity-cell">
            <button class="quantity-btn" @click="decreaseQuantity(item)">-</button>
            <span class="quantity-value">{{ item.quantity }}</span>
            <button class="quantity-btn" @click="increaseQuantity(item)">+</button>
          </td>
          <td class="align-middle">{{ formatPrice(item.price * item.quantity) }}</td>
          <td class="align-middle">
            <button class="delete-btn" @click="deleteproduct(item)">Xoá</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"></td>
          <td>Tổng tiền</td>
          <td>{{ tongsoluong }}</td>
          <td>{{ formatPrice(tongtien) }}</td>
          <td>
            <router-link to="/checkout" class="btn btn-primary" v-if="cart.length > 0">
              Thanh toán<i class="fas fa-arrow-right ms-2"></i>
            </router-link>
          </td>
        </tr>
      </tfoot>
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
      user: null,
    };
  },
  mounted() {
    // Get user from localStorage
    const userJson = localStorage.getItem('currentuser'); // Changed from 'user' to 'currentuser'
    if (userJson) {
      this.user = JSON.parse(userJson);
      // Load cart from database if user is logged in
      this.loadCartFromDatabase();
    }
    
    const id = this.$route.params.id;
    if (id) {
      this.fetchProduct(id);
    }
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
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    },
    async loadCartFromDatabase() {
      try {
        console.log('Loading cart for user ID:', this.user.id);
        const response = await axios.get(`http://localhost:3000/api/cart/${this.user.id}`);
        console.log('Cart data from server:', response.data);
        if (response.data && response.data.length > 0) {
          this.cart = response.data;
          this.updateLocalStorage();
        }
      } catch (error) {
        console.error('Lỗi khi tải giỏ hàng từ cơ sở dữ liệu:', error.response ? error.response.data : error.message);
      }
    },
    increaseQuantity(item) {
      console.log('Item being increased:', item);
      
      // For items from database, product_id contains the actual product ID
      // For items from localStorage, id is the product ID
      const productId = item.product_id || item.id;
      
      // Check if the item has the quality property - fixed ESLint error
      if (!Object.prototype.hasOwnProperty.call(item, 'quality')) {
        // If not, we need to fetch the current product quality from the server
        axios.get(`http://localhost:3000/api/products/${productId}`)
          .then(response => {
            const product = response.data;
            if (item.quantity < product.quality) {
              item.quantity++;
              this.updateProductQuantity(productId, product.quality - 1)
                .then(() => {
                  this.updateLocalStorage();
                })
                .catch(error => {
                  item.quantity--; // Revert on error
                  console.error('Error updating quantity:', error);
                });
            }
          })
          .catch(error => {
            console.error('Error fetching product:', error);
          });
      } else {
        // If the item has quality property, proceed as before
        if (item.quantity < item.quality) {
          item.quantity++;
          this.updateProductQuantity(productId, item.quality - 1)
            .then(() => {
              item.quality--;
              this.updateLocalStorage();
            })
            .catch(error => {
              item.quantity--; // Revert on error
              console.error('Error updating quantity:', error);
            });
        }
      }
    },
    decreaseQuantity(item) {
      console.log('Item being decreased:', item);
      
      const productId = item.product_id || item.id;
      
      if (item.quantity > 1) {
        // Check if the item has the quality property - fixed ESLint error
        if (!Object.prototype.hasOwnProperty.call(item, 'quality')) {
          // If not, we need to fetch the current product quality from the server
          axios.get(`http://localhost:3000/api/products/${productId}`)
            .then(response => {
              const product = response.data;
              item.quantity--;
              this.updateProductQuantity(productId, product.quality + 1)
                .then(() => {
                  this.updateLocalStorage();
                })
                .catch(error => {
                  item.quantity++; // Revert on error
                  console.error('Error updating quantity:', error);
                });
            })
            .catch(error => {
              console.error('Error fetching product:', error);
            });
        } else {
          // If the item has quality property, proceed as before
          item.quantity--;
          this.updateProductQuantity(productId, item.quality + 1)
            .then(() => {
              item.quality++;
              this.updateLocalStorage();
            })
            .catch(error => {
              item.quantity++; // Revert on error
              console.error('Error updating quantity:', error);
            });
        }
      } else {
        this.deleteproduct(item);
      }
    },
    deleteproduct(item) {
      if (this.user) {
        // If user is logged in, delete from database
        axios.delete(`http://localhost:3000/api/cart/${item.id}`)
          .then(() => {
            this.cart = this.cart.filter(x => x.id !== item.id);
            this.updateLocalStorage();
            this.updateProductQuantity(item.product_id, item.quality);
          })
          .catch(error => {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
          });
      } else {
        // If not logged in, just update localStorage
        this.cart = this.cart.filter(x => x.id !== item.id);
        this.updateProductQuantity(item.id, item.quality);
        this.updateLocalStorage();
      }
    },
    
    updateLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    updateProductQuantity(productId, newQuantity) {
      console.log('Updating product quantity:', { productId, newQuantity });
      
      if (!productId) {
        console.error('Product ID is undefined');
        return Promise.reject(new Error('Product ID is undefined'));
      }
      
      // Make sure newQuantity is a number and not negative
      const quantity = Math.max(0, Number(newQuantity) || 0);
      
      // If the quantity is NaN or undefined, don't make the API call
      if (isNaN(quantity)) {
        console.error('Invalid quantity value:', newQuantity);
        return Promise.reject(new Error('Invalid quantity value'));
      }
      
      return axios.patch(`http://localhost:3000/api/products/${productId}`, { quality: quantity })
        .then(response => {
          console.log('Product quantity updated successfully:', response.data);
          return response;
        })
        .catch(error => {
          console.error('Error updating product quantity:', error.response ? error.response.data : error.message);
          throw error;
        });
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }
  },
};
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 50px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 800px;
}

.continue-shopping {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.continue-shopping:hover {
  background-color: #45a049;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.cart-table th, 
.cart-table td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.cart-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.cart-table tbody tr:hover {
  background-color: #f9f9f9;
}

.product-image {
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.quantity-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  background-color: #7c5959;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background-color: #44ce57;
}

.quantity-value {
  margin: 0 10px;
  min-width: 20px;
}

.delete-btn {
  padding: 8px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.checkout-btn {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #45a049;
}

.clear-btn {
  padding: 8px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-btn:hover {
  background-color: #d32f2f;
}

tfoot tr {
  font-weight: bold;
  background-color: #f9f9f9;
}

.align-middle {
  vertical-align: middle;
}
</style>