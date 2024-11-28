<template>

      <div class="banner">
        <img src="/Images/BannerChe.png" alt="quyenle">
      </div>
  <div class="containe">
    <div class="product-list">
      <Product v-for="item in filterproduct" :key="item.id" :product="item" />
      <div v-if="filterproduct.length === 0" class="no-results">
        <p>Không tìm thấy sản phẩm phù hợp</p>
        <button class="reset-search" @click="resetSearch">Xem tất cả sản phẩm</button>
      </div>
    </div>

    <div class="pagination">
      <button 
        v-for="pageNumber in totalPage" 
        :key="pageNumber"
        @click="changePage(pageNumber)"
        :class="{ active: currentpage === pageNumber }"
      >
        {{ pageNumber }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Product from './ComProduct.vue';
import eventBus from '@/eventBus';

export default {
  components: {
    Product

  },
  data() {
    return {
      products: [],
      currentpage: 1,
      limit: 8,
      searchQuery: ''
      
    };
  },
  created() {
    eventBus.on('search', (query) => {
      this.searchQuery = query;
    });
  },
  beforeUnmount() {
    eventBus.off('search');
  },
  computed: {
    filterproduct() {
    const filtered = this.filteredProducts;
    const start = (this.currentpage - 1) * this.limit;
    const end = start + this.limit;
    return filtered.slice(start, end);
  },
  totalPage() {
    return Math.ceil(this.filteredProducts.length / this.limit);
  },
    filteredProducts() {
      return this.products.filter(product => 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
     
  },
  mounted() {
    this.fetchProducts(); 
  },
  methods: {
    
    fetchProducts() {
      axios.get('http://localhost:3000/products')
        .then(response => {
          this.products = response.data;
          if (!Array.isArray(this.products) || this.products.length === 0) {
            alert('Không có sản phẩm nào để hiển thị.');
          }
        })
        .catch(error => {
          console.error('Lỗi khi lấy sản phẩm:', error);
          alert('Không thể lấy danh sách sản phẩm. Vui lòng thử lại sau.');
        });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPage) {
        this.currentpage = page;
        console.log(this.currentpage);
      }
    },
    
    resetSearch() {
      this.searchQuery = '';
      eventBus.emit('resetSearch');
      this.currentpage = 1;
    }
 
   
  }
}
</script>



<style>
.containe {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  width: 100%;
}

/* Responsive grid adjustments */
@media screen and (max-width: 1024px) {
  .product-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 480px) {
  .product-list {
    grid-template-columns: 1fr;
  }
}

.product-list > * {
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.product-list > *:hover {
  transform: scale(1.02);
}

button {
  margin: 5px;
  padding: 10px 15px;
  background-color: #b63aa5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e9c4e4;
}

.pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0;
  padding: 0 10px;
}

.pagination button {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-results {
  width: 100%;
  text-align: center;
  padding: 20px;
  background-color: #fff3f8;
  border-radius: 8px;
  margin: 20px auto;
}

/* Responsive text adjustments */
@media screen and (max-width: 480px) {
  .no-results p {
    font-size: 1rem;
  }
  
  button {
    padding: 8px 12px;
  }
  
  .reset-search {
    padding: 10px 20px;
  }
}

.banner {
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
}

.banner img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media screen and (max-width: 1024px) {
  .banner img {
    height: 350px;
  }
}

@media screen and (max-width: 768px) {
  .banner img {
    height: 300px;
  }
}

@media screen and (max-width: 480px) {
  .banner img {
    height: 200px;
  }
}
</style>