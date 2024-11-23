<template>
  <main>
    <div class="menu-detail">
      <div class="menu-carousel-detail">
        <div class="menu-item-detail">
          <img :src="`http://localhost:3000/${product.image_path}`" alt="Product Image" class="product-image">
        </div>
        <div class="menu-item-info-detail">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p class="product-price-detail" > Giá: {{ product.price }} VND</p>
          <p class="product-quantity-detail">Số lượng còn lại: {{ product.quality }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="product.quality == 0" class="out-of-stock">
      <p>Sản phẩm đã hết hàng</p>
    </div>
    
    <div v-else>
      <button @click="addToCart(product)" class="add-to-cart-button">Thêm vào giỏ hàng</button>
    </div>  
  </main>
</template>
<script>


import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


export default {
  data() {
    return {
      product: {},
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      toast: useToast()
    };
  },
  mounted() {
    const id = this.$route.params.id;
    this.fetchProduct(id);
  },
  methods: {
     async fetchProduct(id) {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        alert('Không thể lấy thông tin sản phẩm. Vui lòng thử lại sau.');
      }
    },
  
    addToCart(product) {
      const infoproduct = this.cart.find(item => item.id == product.id);
      
      if (infoproduct) {
        if (product.quality > 0) {
          infoproduct.quantity += 1;
          product.quality--;
           this.updateProductQuantity(product.id, product.quality);
          this.showSuccessMessage(product.name);
        } else {
          this.showOutOfStockMessage();
        }
      } else {
        if (product.quality > 0) {
          const newproduct = { ...product, quantity: 1 };
          this.cart.push(newproduct);
          product.quality--;
           this.updateProductQuantity(product.id, product.quality);
          this.showSuccessMessage(product.name);
        } else {
          this.showOutOfStockMessage();
        }
      }
      this.updateLocalStorage();
    },

    showSuccessMessage(productName) {
      this.toast.success(`Đã thêm ${productName} vào giỏ hàng!`, {
        position: 'top-right',
        duration: 3000,
        dismissible: true
      });
    },

    showOutOfStockMessage() {
      this.toast.error('Sản phẩm đã hết hàng!', {
        position: 'top-right',
        duration: 3000,
        dismissible: true
      });
    
  },
   
    async updateProductQuantity(productId, newQuantity) {
      try {
        await axios.patch(`http://localhost:3000/products/${productId}`, { quality: newQuantity });
      } catch (error) {
        console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
        alert('Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.');
      }
    },
    updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart)); // Cập nhật giỏ hàng vào localStorage
  }
  }
}
</script>


<style>
.menu-detail {
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.menu-carousel-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.menu-item-detail {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.product-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.5s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

.menu-item-info-detail {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.menu-item-info-detail h3 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.menu-item-info-detail p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.product-price-detail {
  font-size: 22px;
  color: #e74c3c;
  font-weight: bold;
  margin: 20px 0;
}

.product-quantity-detail {
  font-size: 18px;
  color: #27ae60;
  font-weight: 500;
  margin-bottom: 20px;
}

.out-of-stock {
  background: #fff5f5;
  color: #e53e3e;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
}

.add-to-cart-button {
  width: 20%;
  padding: 15px 30px;
  background: #c465b7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.add-to-cart-button:hover {
  background: #ad3d5d;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(173, 61, 93, 0.3);
}

@media (max-width: 768px) {
  .menu-carousel-detail {
    grid-template-columns: 1fr;
  }
  
  .product-image {
    height: 300px;
  }
  
  .menu-detail {
    margin: 20px;
    padding: 20px;
  }
}
</style>
