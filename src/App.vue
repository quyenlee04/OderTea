<template>
  <Header/>
  <Footer/>
</template>

<script>
// muốn gọi component thì import,2-đang ký components
// import Home from './components/ComHome.vue'
import Header from './components/ComHeader.vue'
import Footer from './components/ComFooter.vue'
export default {
  name: 'App',
  // đăng ký
  components: {
    // Home,
    Header,
    Footer,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
