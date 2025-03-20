import { createWebHistory,createRouter } from "vue-router";
import Home from '@/components/ComHome.vue'
import GioiThieu from '@/components/ComGioiThieu.vue'
import ProductDetail from '@/components/ComProductDetail.vue'
import Cart from '@/components/ComCart.vue'
import Register from '@/components/ComRegister.vue'
import Login from '@/components/ComLogin.vue'
// import Payment from '@/components/ComPayment.vue'
import Checkout from '@/components/Checkout.vue';
import OrderConfirmation from '@/components/OrderConfirmation.vue';
import UserOrders from '@/components/UserOrders.vue';


const routes = [
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
    // {
    //     path:'/payment',
    //     name:'Payment',
    //     component: Payment
    // },
    {
        path: '/checkout',
        name: 'Checkout',
        component: Checkout,
        // meta: { requiresAuth: true }
    },
    {
        path: '/order-confirmation/:id',
        name: 'OrderConfirmation',
        component: OrderConfirmation,
        // meta: { requiresAuth: true }
    },
    {
        path: '/account/orders',
        name: 'UserOrders',
        component: UserOrders,
        // meta: { requiresAuth: true }
    }
];
// tạo đối tượng
const router=createRouter({
    history:createWebHistory(),
    routes
});
export default router