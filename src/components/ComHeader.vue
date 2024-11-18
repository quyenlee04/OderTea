<template>
  <header>
    <div class="container">
      <div class="logo">
        <img src="/Images/Logo.png" alt="quyenle">
      </div>
      
      <nav>
        <ul>
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><router-link to="/gioithieu">Giới Thiệu</router-link></li>
          <li v-if="!user"><router-link to="/register">Đăng Ký</router-link></li>
          <li v-if="!user"><router-link to="/login">Đăng Nhập</router-link></li>
        </ul>
      </nav>
  <div class="search-box desktop-search">
        <input 
          type="text" 
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Tìm kiếm sản phẩm..."
        >
      </div>

        <div class="mobile-search">
        <i class="fas fa-search" @click="toggleSearch"></i>
        <div class="search-modal" v-if="isSearchVisible">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Tìm kiếm sản phẩm..."
            ref="mobileSearchInput"
          >
          <i class="fas fa-times" @click="toggleSearch"></i>
        </div>
      </div>
      
      <div v-if="user" class="user-info">
        <p>Xin chào, {{ user.username }}</p>
        <button @click="logout">Đăng xuất</button>
      </div>

      <div class="cta">
        <router-link to="/cart" class="cart-icon">
          <i class="fas fa-shopping-cart"></i>
        </router-link>
      </div>
    </div>
  </header>
  <router-view/>
</template>

<script>
import eventBus from '@/eventBus';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('currentuser')) || null,
     searchQuery: '',
     isSearchVisible: false
    };
  },
  created() {
    eventBus.on('loginSuccess', (user) => {
      this.user = user;
    });
  },
  beforeUnmount() {
    eventBus.off('loginSuccess');
  },
  methods: {
    handleSearch() {
      eventBus.emit('search', this.searchQuery);
    },
     toggleSearch() {
      this.isSearchVisible = !this.isSearchVisible;
      if (this.isSearchVisible) {
        this.$nextTick(() => {
          this.$refs.mobileSearchInput.focus();
        });
      }
    },
    
    logout() {
      localStorage.removeItem('currentuser');
      this.user = null;
      this.$router.push('/');
    },
   
  }
};
</script>
<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffffff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.logo img {
  height: 50px;
  object-fit: contain;
}

nav ul {
  display: flex;
  gap: 25px;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav ul li a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 15px;
  transition: color 0.2s ease;
  padding: 5px 0;
  position: relative;
}

nav ul li a:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #ad3d5d;
  transition: width 0.3s ease;
}

nav ul li a:hover:after {
  width: 100%;
}

.search-box {
  position: relative;
  margin: 0 20px;
}

.search-box input {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 25px;
  width: 220px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f8f8f8;
}

.search-box input:focus {
  border-color: #ad3d5d;
  background: #fff;
  box-shadow: 0 0 10px rgba(173, 61, 93, 0.1);
}
.mobile-search {
  display: none;
}

.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
}

.search-modal input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
}

.search-modal .fa-times {
  padding: 10px;
  cursor: pointer;
  color: #666;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info p {
  color: #333;
  font-weight: 500;
}

.user-info button {
  background: #ad3d5d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info button:hover {
  background: #8e324d;
  transform: translateY(-2px);
}

.cart-icon {
  color: #333;
  font-size: 20px;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.cart-icon:hover {
  color: #ad3d5d;
  background: rgba(173, 61, 93, 0.1);
}

@media screen and (max-width: 992px) {
  .container {
    padding: 15px;
  }
  
  .search-box input {
    width: 180px;
  }
}

@media screen and (max-width: 768px) {
  .container {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  nav ul {
    gap: 15px;
  }
  
  .search-box {
    order: 2;
    width: 100%;
    margin: 10px 0;
  }
  
  .search-box input {
    width: 100%;
  }
}

@media screen and (max-width: 480px) {
  nav ul {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .user-info {
    width: 100%;
    justify-content: center;
  }
}
@media screen and (max-width: 768px) {
  .desktop-search {
    display: none;
  }
  
  .mobile-search {
    display: block;
  }
  
  .mobile-search .fa-search {
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
  }
}
</style>
