<template>
  <div class="checkout-page">
    <div class="container py-5">
      <h1 class="mb-4">Thanh toán</h1>
      
      <div class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h5>Thông tin giao hàng</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="placeOrder">
                <div class="mb-3">
                  <label for="address" class="form-label">Địa chỉ giao hàng</label>
                  <textarea 
                    id="address" 
                    v-model="shippingAddress" 
                    class="form-control" 
                    rows="3" 
                    required
                    :placeholder="user && user.address ? user.address : 'Nhập địa chỉ giao hàng'"
                  ></textarea>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Phương thức thanh toán</label>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="paymentMethod" id="cod" value="cod" v-model="paymentMethod" checked>
                    <label class="form-check-label" for="cod">
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="paymentMethod" id="bank" value="bank" v-model="paymentMethod">
                    <label class="form-check-label" for="bank">
                      Chuyển khoản ngân hàng
                    </label>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary" :disabled="isProcessing">
                  <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đặt hàng
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5>Đơn hàng của bạn</h5>
            </div>
            <div class="card-body">
              <div v-if="cartItems.length === 0" class="text-center py-3">
                <p>Giỏ hàng trống</p>
                <router-link to="/products" class="btn btn-outline-primary">Tiếp tục mua sắm</router-link>
              </div>
              
              <ul v-else class="list-group mb-3">
                <li v-for="item in cartItems" :key="item.id" class="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 class="my-0">{{ item.name }} x {{ item.quantity }}</h6>
                    <small class="text-muted">{{ item.description && item.description.substring(0, 50) + '...' }}</small>
                  </div>
                  <span class="text-muted">{{ formatPrice(item.price * item.quantity) }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Tổng cộng</span>
                  <strong>{{ formatPrice(totalAmount) }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderService from '@/services/OrderService';

export default {
  name: 'CheckoutPage',
  data() {
    return {
      shippingAddress: '',
      paymentMethod: 'cod',
      isProcessing: false,
      user: null,
      cartItems: [],
      isAuthenticated: false
    };
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  created() {
    // Get user from localStorage
    const userJson = localStorage.getItem('currentuser');
    if (userJson) {
      this.user = JSON.parse(userJson);
      this.isAuthenticated = true;
    }
    
    // Get cart from localStorage
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
      this.cartItems = JSON.parse(cartJson);
    }
    
    if (!this.isAuthenticated) {
      this.$router.push('/login?redirect=checkout');
      return;
    }
    
    if (this.cartItems.length === 0) {
      this.$router.push('/cart');
      return;
    }
    
    // Pre-fill shipping address if user has one
    if (this.user && this.user.address) {
      this.shippingAddress = this.user.address;
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    async placeOrder() {
      if (this.cartItems.length === 0) {
        alert('Giỏ hàng trống');
        return;
      }
      
      this.isProcessing = true;
      
      try {
        // Include all necessary data for the order
        const orderData = {
          user_id: this.user.id,
          shipping_address: this.shippingAddress,
          payment_method: this.paymentMethod,
          total_amount: this.totalAmount,
          items: this.cartItems.map(item => ({
            product_id: item.product_id || item.id,
            quantity: item.quantity,
            price: item.price
          }))
        };
        
        console.log('Sending order data:', orderData);
        
        const response = await OrderService.createOrder(orderData);
        
        // Clear cart after successful order
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Redirect to order confirmation page
        this.$router.push(`/order-confirmation/${response.data.order_id}`);
        alert('Đặt hàng thành công!');
      } catch (error) {
        console.error('Order error:', error);
        alert(error.response?.data?.error || 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.');
      } finally {
        this.isProcessing = false;
      }
    }
  }
};
</script>

<style scoped>
.checkout-page {
  min-height: 70vh;
  padding: 3rem 0;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #ad3d5d;
  font-weight: 700;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 1rem;
  text-align: center;
}

h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, #ad3d5d, #f3a3b5);
  border-radius: 3px;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.card-header h5 {
  color: #333;
  font-weight: 600;
  margin: 0;
  font-size: 1.25rem;
}

.card-body {
  padding: 2rem;
  background-color: #fff;
}

.form-label {
  font-weight: 500;
  color: #444;
  margin-bottom: 0.75rem;
}

.form-control {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-control:focus {
  border-color: #ad3d5d;
  box-shadow: 0 0 0 0.25rem rgba(173, 61, 93, 0.15);
  background-color: #fff;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.form-check {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.form-check-input {
  width: 1.2rem;
  height: 1.2rem;
  margin-top: 0.25rem;
  margin-left: -2rem;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #ad3d5d;
  border-color: #ad3d5d;
}

.form-check-label {
  cursor: pointer;
  padding-left: 0.5rem;
}

.btn-primary {
  background: linear-gradient(to right, #ad3d5d, #c25e7c);
  border: none;
  border-radius: 30px;
  padding: 0.75rem 2.5rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(173, 61, 93, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(to right, #9a3652, #b04e6c);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(173, 61, 93, 0.3);
}

.btn-primary:disabled {
  background: linear-gradient(to right, #d98ca3, #e5a8b9);
  box-shadow: none;
}

.list-group {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.list-group-item {
  border: none;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-group-item:last-child {
  border-bottom: none;
  background-color: #f8f9fa;
  font-weight: 700;
  color: #ad3d5d;
}

.list-group-item h6 {
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.text-muted {
  color: #6c757d;
  font-size: 0.9rem;
}

.spinner-border {
  width: 1.5rem;
  height: 1.5rem;
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 2rem 0;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .btn-primary {
    width: 100%;
  }
  
  h1 {
    font-size: 1.75rem;
  }
}
</style>