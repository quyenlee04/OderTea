<template>
  <footer>
    <div class="footer-container">
      <div class="footer-column">
        <h3>Liên hệ với tôi qua:</h3>
        <div class="contact-links">
          <p>
            <a href="mailto:quyenle5184@gmail.com"><i class="fas fa-envelope"></i>Email</a>
          </p>
          <p>
            <a href="https://www.facebook.com/quyenj09" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-facebook"></i> Facebook
            </a>
          </p>
          <p>
            <a href="https://www.instagram.com/quyenlei/" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram"></i> Instagram
            </a>
          </p>
        </div>
      </div>
      <div class="footer-column">
        <h3>Liên hệ</h3>
        <p>Địa chỉ: 601/33/21 Thống Nhất, Phường 16, Gò Vấp, Hồ Chí Minh</p>
        <p>Điện thoại: 0364048055</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Bản quyền thuộc về QuyếnLe.</p>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style>
footer {
  background-color: #ebc0c0;
  color: #333333;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid #d19c9c;
  padding-bottom: 20px;
}

.footer-column {
  flex: 1;
  min-width: 200px;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
}

.footer-column h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #4b4b4b;
}

.contact-links p {
  margin: 8px 0;
}

.footer-column a {
  color: #3a1933;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  transition: color 0.3s;
}

.footer-column a i {
  margin-right: 8px;
}

.footer-column a:hover {
  color: #ad3d5d;
}

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #4b4b4b;
  padding-top: 20px;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
  }
  .footer-column {
    text-align: left;
    padding: 15px 0;
  }
}
</style>