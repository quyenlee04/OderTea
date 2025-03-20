<template>
  <div class="user-orders">
    <h2 class="mb-4">Đơn hàng của tôi</h2>
    
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else-if="orders.length === 0" class="text-center py-5">
      <p>Bạn chưa có đơn hàng nào.</p>
      <router-link to="/products" class="btn btn-primary">Mua sắm ngay</router-link>
    </div>
    
    <div v-else class="order-list">
      <div v-for="order in orders" :key="order.id" class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <span class="fw-bold">Đơn hàng #{{ order.id }}</span>
            <span class="text-muted ms-3">{{ formatDate(order.created_at) }}</span>
          </div>
          <span class="badge" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
        </div>
        
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <p><strong>Sản phẩm:</strong> {{ order.product_names }}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {{ order.shipping_address }}</p>
              <p><strong>Phương thức thanh toán:</strong> {{ getPaymentMethodText(order.payment_method) }}</p>
            </div>
            <div class="col-md-4 text-md-end">
              <p class="mb-3"><strong>Tổng tiền:</strong> {{ formatPrice(order.total_amount) }}</p>
              <router-link :to="`/order-confirmation/${order.id}`" class="btn btn-outline-primary btn-sm">
                Xem chi tiết
              </router-link>
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
  name: 'UserOrders',
  data() {
    return {
      orders: [],
      loading: true,
      error: null,
      user: null
    };
  },
  async created() {
    // Get user from localStorage
    const userJson = localStorage.getItem('currentuser');
    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    
    if (!this.user) {
      this.error = 'Vui lòng đăng nhập để xem đơn hàng';
      this.loading = false;
      return;
    }
    
    try {
      const response = await OrderService.getUserOrders(this.user.id);
      this.orders = response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      this.error = 'Không thể tải danh sách đơn hàng';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },
    getStatusText(status) {
      const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status] || status;
    },
    getStatusClass(status) {
      const classMap = {
        'pending': 'bg-warning',
        'processing': 'bg-info',
        'shipped': 'bg-primary',
        'delivered': 'bg-success',
        'cancelled': 'bg-danger'
      };
      return classMap[status] || 'bg-secondary';
    },
    getPaymentMethodText(method) {
      const methodMap = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank': 'Chuyển khoản ngân hàng'
      };
      return methodMap[method] || method;
    }
  }
};
</script>

<style scoped>
.user-orders {
  min-height: 60vh;
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

h2.mb-4 {
  color: #ad3d5d;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}

h2.mb-4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, #ad3d5d, #f3a3b5);
  border-radius: 3px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
}

.card-body {
  padding: 1.5rem;
}

.badge {
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 30px;
  font-size: 0.8rem;
}

.btn-outline-primary {
  color: #ad3d5d;
  border-color: #ad3d5d;
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: #ad3d5d;
  color: white;
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #ad3d5d;
  border-color: #ad3d5d;
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #8e324d;
  border-color: #8e324d;
  transform: translateY(-2px);
}

.text-muted {
  color: #6c757d;
  font-size: 0.9rem;
}

.spinner-border {
  color: #ad3d5d;
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .col-md-4.text-md-end {
    text-align: left !important;
    margin-top: 1rem;
  }
}
</style>