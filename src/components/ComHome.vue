<template>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
.product-list {
  display: flex; 
  justify-content: flex-start; 
  flex-wrap: wrap; 
  padding: 20px;
  width: 100%;
}

.product-list > * {
  flex: 0 0 23%; 
  margin: 10px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
  border-radius: 8px; 
  overflow: hidden; 
  transition: transform 0.3s; 
} 

.product-list > *:hover {
  transform: scale(1.05); 
}

button {
  margin: 5px; 
  padding: 10px 15px; 
  background-color: #c465b7; 
  color: white; 
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 
  transition: background-color 0.3s; 
}

button:hover {
  background-color: #882a7b; 
}

button:disabled {
  background-color: #ccc; 
  cursor: not-allowed; 
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  width: 100%;
}

.pagination button {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button.active {
  background-color: #882a7b;
}

.no-results {
  width: 100%;
  text-align: center;
  padding: 40px 20px;
  background-color: #fff3f8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}

.no-results p {
  font-size: 1.2em;
  color: #c465b7;
  margin-bottom: 15px;
  font-weight: bold;
}

.reset-search {
  background-color: #c465b7;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-search:hover {
  background-color: #882a7b;
  transform: translateY(-2px);
}



</style>