<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-header">
        <h2>Welcome Back</h2>
        <p>Vui lòng đăng nhập để tiếp tục</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input 
              v-model="username" 
              type="text" 
              placeholder="Tên đăng nhập"
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Mật khẩu"
              required 
            />
          </div>
        </div>

       

        <button type="submit" class="btn-login">
          <span>Đăng Nhập</span>
          <i class="fas fa-arrow-right"></i>
        </button>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ error }}</span>
        </div>
      </form>

      <div class="login-footer">
        <p>Chưa có tài khoản? <router-link to="/register">Đăng ký</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import eventBus from '@/eventBus';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      toast: useToast()

    };
  },
  methods: {
    async login() {
      if (!this.username) {
        this.error = "Vui lòng nhập tên đăng nhập";
        return;
      }
      if(!this.password){
        this.error = "Vui lòng nhập mật khẩu"
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/login', {
          username: this.username,
          password: this.password
        });

        localStorage.setItem('currentuser', JSON.stringify(response.data.user));

        eventBus.emit('loginSuccess', response.data.user);
        this.toast.success('Đăng nhập thành công!', {
          position: 'top-right',
          duration: 3000
        })
        this.$router.push('/');
      } catch (error) {
        if (error.response && error.response.data) {
          this.error = error.response.data.error;
        } else {
          this.error = "Đăng nhập không thành công";
        }
      }
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c465b7 0%, #ad3d5d 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  color: #333;
  font-size: 2em;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 1.1em;
}

.form-group {
  margin-bottom: 25px;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.forgot-password {
  color: #c465b7;
  text-decoration: none;
}

.btn-login {
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
}

.btn-login:hover {
  background: #ad3d5d;
  transform: translateY(-2px);
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background: #ffe5e5;
  color: #e53e3e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  color: #666;
}

.login-footer a {
  color: #c465b7;
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
  }
}
</style>