<template>
  <div class="about-container">
    <h1>Giới Thiệu Về Chè</h1>
    <p>
      Chào mừng bạn đến với cửa hàng chè của chúng tôi! Chúng tôi chuyên cung cấp các loại chè ngon và chất lượng nhất từ khắp nơi trên đất nước.
    </p>
    <p>
      Với nhiều năm kinh nghiệm trong ngành, chúng tôi cam kết mang đến cho bạn những món chè tươi ngon, mát lạnh, an toàn và bổ dưỡng. Chúng tôi tin rằng mỗi ly chè không chỉ là một món ăn ngon, mà còn là một trải nghiệm văn hóa đặc sắc.
    </p>

    <h2>Các loại chè chúng tôi cung cấp:</h2>
    <ul>
      <li>Chè Việt Nam</li>
      <li>Chè Lào</li>
      <li>Chè Hongkong</li>
      <li>Chè Thái</li>
      <li>Chè Campuchia</li>
    </ul>

    <h2>Cam kết của chúng tôi:</h2>
    <p>
      Chúng tôi cam kết sử dụng nguyên liệu tự nhiên, không chất bảo quản, để đảm bảo sức khỏe cho khách hàng. Mỗi sản phẩm chè đều được chế biến với tình yêu và tâm huyết từ đội ngũ chuyên gia của chúng tôi.
    </p>

    <h2>Liên hệ với chúng tôi:</h2>
    <p>
      Nếu bạn có bất kỳ câu hỏi nào hoặc cần thêm thông tin, hãy liên hệ với chúng tôi qua:
    </p>
    <p>Email: <a href="mailto:test@gmail.com">test@gmail.com</a></p>
    <p>Điện thoại: <strong>098765456</strong></p>

    <div class="image-gallery">
      <img src="/Images/che1.jpg" alt="Chè 1" />
      <img src="/Images/che2.jpg" alt="Chè 2" />
      <img src="/Images/che3.jpg" alt="Chè 3" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComGioiThieu'
}
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: left;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

h2 {
  color: #555;
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

.image-gallery {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.image-gallery img {
  width: 30%; /* Điều chỉnh kích thước hình ảnh */
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>