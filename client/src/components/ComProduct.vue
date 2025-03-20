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
    margin: 0 auto;
}

.menu-item a {
    text-decoration: none;
    display: block;
    background: #fff;
    transition: transform 0.3s ease;
}

.menu-item a:hover {
    transform: translateY(-5px);
}

.menu-item img {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
    display: block;
}

.menu-item-info {
    padding: 15px;
    background-color: #fff;
    text-align: center;
}

.menu-item-info h3 {
    font-size: 1.1rem;
    margin: 0 0 8px 0;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.menu-item-info p {
    color: #f71e1e;
    font-size: 1rem;
    margin: 0;
    font-weight: 600;
}


@media screen and (max-width: 768px) {
    .menu-carousel {
        max-width: 100%;
    }

    .menu-item img {
        height: 200px;
    }

    .menu-item-info {
        padding: 10px;
    }

    .menu-item-info h3 {
        font-size: 1rem;
    }

    .menu-item-info p {
        font-size: 0.9rem;
    }
}

@media screen and (max-width: 480px) {
    .menu-item img {
        height: 180px;
    }
}
</style>