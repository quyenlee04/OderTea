<template>
   <main>  
        <div class="menu">
            <div class="menu-carousel">
                <div class="menu-item">
                    <router-link :to = "{name: 'ProductDetail', params:{id}} ">
                    <img :src="`http://localhost:3000/${product.image_path}`" alt="Chè">
                    <div class="menu-item-info">
                        <h3>{{product.name}}</h3>
                        <p> Giá:{{product.price}} VND</p>
                    </div>
                    </router-link>
                </div>
            </div>
        </div>  
    </main>
</template>

<script>
export default {
    
    props:['product'],
    data(){
        return{
            id:this.product.id
        }
    }
}
</script>


<style>


.menu-carousel {
    width: 100%;
    max-width: 300px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.menu-item a {
    text-decoration: none;
    flex: 0 0 23%; 
    margin: 6px; /* Khoảng cách giữa các sản phẩm */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
}


.menu-item img {
    width: 100%; 
    height: 100%;
    object-fit: cover; 
    border-radius: 8px 8px 0 0;
}

.menu-item-info {
    padding: 10px;
    background-color: #fff;
    text-align: center;
    border-top: 1px solid #ddd;
}

.menu-item-info h3 {
    font-size: 1.2em;
    margin: 5px 0;
    color: #333;
}

.menu-item-info p {
    color: #f71e1e;
    font-size: 1em;
}


</style>