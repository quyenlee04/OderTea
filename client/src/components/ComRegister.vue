<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-header">
        <h2>Đăng Ký Tài Khoản</h2>
        <p>Điền thông tin để tạo tài khoản mới</p>
      </div>

      <form @submit.prevent="register" class="register-form">
        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input v-model="username" type="text" placeholder="Tên đăng nhập" required />
          </div>
        </div>

        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-id-card"></i>
            <input v-model="fullname" type="text" placeholder="Họ và tên" required />
          </div>
        </div>

        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-envelope"></i>
            <input v-model="email" type="email" placeholder="Email" required />
          </div>
        </div>

        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-map-marker-alt"></i>
            <input v-model="address" type="text" placeholder="Địa chỉ" required />
          </div>
        </div>

        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-phone"></i>
            <input 
              v-model="phone" 
              type="text" 
              placeholder="Số điện thoại" 
              maxlength="10" 
              required 
              pattern="^0\d{9}$"
              title="Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input v-model="password" type="password" placeholder="Mật khẩu" required />
          </div>
        </div>

        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" required />
          </div>
        </div>

        <button type="submit" class="btn-register">
          <span>Đăng Ký</span>
          <i class="fas fa-arrow-right"></i>
        </button>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ error }}</span>
        </div>
      </form>

      <div class="register-footer">
        <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      fullname: "",
      password: "",
      confirmPassword: "",
      email: "",
      address: "",
      phone: "",
      error: ""
    };
  },
  methods: {
    register() {
      // Validate username
      if (!this.username) {
        this.error = "Vui lòng nhập tên đăng nhập";
        return;
      }
      
      // Validate fullname
      if (!this.fullname) {
        this.error = "Vui lòng nhập họ tên";
        return;
      }

      // Validate email
      if (!this.email) {
        this.error = "Vui lòng nhập email";
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.error = "Email không hợp lệ";
        return;
      }

      // Validate address
      if (!this.address) {
        this.error = "Vui lòng nhập địa chỉ";
        return;
      }

      // Validate phone
      if (!this.phone) {
        this.error = "Vui lòng nhập số điện thoại";
        return;
      }
      
      
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(this.phone)) {
        this.error = "Số điện thoại không hợp lệ";
        return;
      }

     
      if (!this.password) {
        this.error = "Vui lòng nhập mật khẩu";
        return;
      }

      
      if (this.password.length < 6) {
        this.error = "Mật khẩu phải có ít nhất 6 ký tự";
        return;
      }

  
      if (this.password !== this.confirmPassword) {
        this.error = "Mật khẩu không khớp";
        return;
      }

      axios.post('http://localhost:3000/api/auth/register', {
    username: this.username,
    fullname: this.fullname,
    password: this.password,
    email: this.email,
    address: this.address,
    phone: this.phone
})
.then(() => {
    alert("Đăng ký thành công!");
    this.$router.push('/login');
})
.catch(error => {
    if (error.response && error.response.data) {
        this.error = error.response.data.error;
    } else {
        this.error = "Đã xảy ra lỗi, vui lòng thử lại sau.";
    }
});

    }
}
};
</script>


<style scoped>
.register-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c465b7 0%, #ad3d5d 100%);
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-out;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  font-size: 2em;
  margin-bottom: 10px;
}

.register-header p {
  color: #666;
  font-size: 1.1em;
}

.form-group {
  margin-bottom: 20px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group i {
  position: absolute;
  left: 15px;
  color: #666;
  transition: color 0.3s ease;
}

.input-group input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #c465b7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(196, 101, 183, 0.1);
}

.input-group input:focus + i {
  color: #c465b7;
}

.btn-register {
  width: 100%;
  padding: 15px;
  background: #c465b7;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-register:hover {
  background: #ad3d5d;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(173, 61, 93, 0.3);
}

.error-message {
  margin-top: 15px;
  padding: 12px;
  background: #ffe5e5;
  color: #e53e3e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: shake 0.5s ease-in-out;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-footer a {
  color: #c465b7;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-footer a:hover {
  color: #ad3d5d;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 480px) {
  .register-container {
    padding: 30px 20px;
  }
}
</style>
