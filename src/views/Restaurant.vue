<script>
import axios from 'axios';
import CartBTN from '../components/CartBTN.vue'
export default {
    data() {
        return {
            products: null,
            restaurant: null,
            // categories:null,

        };
    },
    components: {
        CartBTN
    },
    created() {
        axios
            .get(`http://127.0.0.1:8000/api/restaurants/${this.$route.params.slug}`)
            .then(response => {
                console.log(response.data);
                this.products = response.data.restaurants.dishes;
                this.restaurant = response.data.restaurants;
            });




    }
}
</script>


<template>
    <main>
        <div class="container restaurant-info mb-5">
            <div class="row d-flex flex-row row-cols-1 row-cols-md-1 row-cols-lg-2">
                <div class="col">
                    <img class="rounded" :src="restaurant.image" alt="">
                </div>
                <div class="col">
                    <h1 class="mt-3">
                        {{ restaurant.restaurant_name }}
                    </h1>

                    <p class="text-white">{{ restaurant.description }}</p>
                    <p class="text-white">{{ restaurant.address }}</p>
                    <span class="badge rounded-pill text-dark me-2 fs-6 "
                        v-for="(category, index) in restaurant.categories">{{ category.name }}</span>

                </div>
            </div>


        </div>

        <div class="container menu">
            <h2 class="text-center text-white mb-5">I nostri piatti:</h2>
            <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4  d-flex justify-content-center g-4 ">

                <div v-for="product in products" class="col">
                    <div class="card border-0 ">
                        <img :src="product.image" class="card-img-top " alt="...">
                        <div class="card-body">
                            <h4 class="card-title">{{ product.name }}</h4>
                            <p class="card-text fw-normal">{{ product.description }}</p>
                            <p class="card-text">{{ product.price }}€</p>
                            <div class="btn-group">
                                <CartBTN :product="product" />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div class="d-flex justify-content-center">
                <router-link :to="{ name: 'Home' }" class="link-btn btn mt-5 d-flex justify-content-center">
                    TORNA A TUTTI I RISTORANTI
                </router-link>
            </div>
        </div>

    </main>
</template>

<style lang="scss">
main {
    height: 100%;

    background: rgb(27, 22, 30);
    background: linear-gradient(0deg, rgba(27, 22, 30, 1) 0%, rgba(111, 125, 140, 1) 50%, rgba(27, 22, 30, 1) 100%);

    .card {
        background-color: white;

        height: 100%;


        img {

            height: 200px;
            object-fit: cover;
        }

        p {
            color: black;
        }
    }

    .restaurant-info {
        img {
            width: 100%;
            height: auto;
        }

        h1 {
            color: $secondary-color;
        }

        span {
            background-color: $secondary-color;
        }
    }

    .menu {
        padding-bottom: 200px;
    }

    .btn.link-btn {
        background-color: $secondary-color;
        color: black;
        font-weight: 800;
    }

    .link-btn:hover {
        transform: translateY(-2px);
    }

}
</style>