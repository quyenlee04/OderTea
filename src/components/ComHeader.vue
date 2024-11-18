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
  <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Tìm kiếm sản phẩm..."
        >
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
     searchQuery: '' 
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.search-box {
  margin: 0 20px;
}

.search-box input {
  padding: 8px 15px;
  border: 2px solid #ad3d5d;
  border-radius: 20px;
  width: 250px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: #ad3d5d;
  box-shadow: 0 0 5px rgba(252, 176, 52, 0.3);
}

.logo img {
  height: 50px;
  transition: transform 0.3s ease;
}

nav ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

nav ul li {
  margin: 0 15px;
}

nav ul li a {
  text-decoration: none;
  color: #000;
  font-weight: bold;
  transition: color 0.3s ease;
}

nav ul li a:hover {
  color: #ad3d5d;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info p {
  margin-right: 10px;
  color: #555;
  font-size: 14px;
}

.user-info button {
  padding: 6px 12px;
  background-color: #c28abb;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-info button:hover {
  background-color: #ad3d5d;
}

.cart-icon {
  color: #555;
  font-size: 20px;
  padding: 10px;
  transition: color 0.3s ease, transform 0.3s ease;
}

.cart-icon:hover {
  color: #ad3d5d;
  transform: scale(1.1);
}
</style>
