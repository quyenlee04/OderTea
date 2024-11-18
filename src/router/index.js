import { createWebHistory,createRouter } from "vue-router";
import Home from '@/components/ComHome.vue'
import GioiThieu from '@/components/ComGioiThieu.vue'
import ProductDetail from '@/components/ComProductDetail.vue'
import Cart from '@/components/ComCart.vue'
import Register from '@/components/ComRegister.vue'
import Login from '@/components/ComLogin.vue'
import Payment from '@/components/ComPayment.vue'
// tạo một mảng chứa những đường link
const routes=[
    // đối tượng
     // trang chủ là trang load lên đầu tiên path:"/"
    {
        path:'/',
        name:'Home',
        component:Home
    },
   
    {
        path:'/gioithieu',
        name:'GioiThieu',
        component:GioiThieu
    },
    {
        path:"/product/:id",
        name:"ProductDetail",
        component:ProductDetail
    },
    {
        path:'/cart',
        name:'Cart',
        component:Cart
    },
    {
        path:'/register',
        name:'Register',
        component:Register
    },
    {
        path:'/login',
        name:'Login',
        component:Login
    },
    {
        path:'/payment',
        name:'Payment',
        component: Payment
    }
]
// tạo đối tượng
const router=createRouter({
    history:createWebHistory(),
    routes
});
export default router