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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid #d19c9c;
  padding-bottom: 30px;
}

.footer-column {
  padding: 20px;
  text-align: center;
}

.footer-column h3 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #4b4b4b;
  position: relative;
  display: inline-block;
}

.footer-column h3:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background-color: #ad3d5d;
}

.contact-links p {
  margin: 15px 0;
}

.footer-column a {
  color: #3a1933;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.footer-column a i {
  margin-right: 10px;
  font-size: 1.2rem;
}

.footer-column a:hover {
  color: #ad3d5d;
  background-color: rgba(173, 61, 93, 0.1);
  transform: translateY(-2px);
}

.footer-column p {
  line-height: 1.6;
  margin: 10px 0;
}

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  padding: 20px 0;
  font-size: 0.9rem;
  color: #4b4b4b;
}

@media (max-width: 768px) {
  footer {
    padding: 30px 15px;
  }

  .footer-container {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }

  .footer-column {
    padding: 10px;
  }

  .footer-column h3 {
    font-size: 1.1rem;
  }

  .contact-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .footer-column a {
    width: 100%;
    justify-content: center;
  }
  
  .footer-column p {
    font-size: 0.9rem;
    padding: 0 15px;
  }
}
</style>
