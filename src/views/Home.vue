<script>
import CartBTN from '../components/CartBTN.vue'

import axios from 'axios'
export default {
    
    setup() {
       
    },
    components :{CartBTN},
    data(){
        return{
            restaurants:[],
            categories:[],
            selectedCategories: [],
            currentPage: 1,
            totalPages:1,
            noResults: false  
        }
    },
    created() {

        this.getAllRestaurants(1);
        
        axios
            .get('http://127.0.0.1:8000/api/categories')
            .then(response => {
                console.log(response.data);
            this.categories = response.data.categories;
            });
            
    },
    methods: {
        filterRestaurants() {
            const selectedCategories = this.selectedCategories.join(',');
            const url = `http://localhost:8000/api/categories/${selectedCategories}`;

            axios
                .get(url)
                .then(response => {
                    // la risposta contiene le informazioni della categoria selezionata
                    console.log(response.data.categories);
                    let restaurants = [];
                    response.data.categories.forEach(category => {
                    category.restaurants.forEach(restaurant => {
                        // verifica se il ristorante appartiene a tutte le categorie selezionate
                        const belongsToAllCategories = this.selectedCategories.every(catId => {
                            return restaurant.categories.some(rCat => rCat.id === catId);
                        });
                        if (belongsToAllCategories) {
                                // verifica se il ristorante è già presente nell'array
                            const index = restaurants.findIndex(r => r.id === restaurant.id);
                            if (index === -1) {
                            // se il ristorante non è presente nell'array, aggiungilo
                            restaurants.push(restaurant);
                            }
                        }           
                    });
                    });
                    this.restaurants = restaurants;

                    // verifica se ci sono risultati o meno
                    this.noResults = this.restaurants.length === 0;
                })
                .catch(error => {
                    // in caso di errore, mostra un messaggio di avviso
                    console.log('Errore:', error);
                });
        },
        getAllRestaurants(page) {
            
            axios
            .get(`http://127.0.0.1:8000/api/restaurants?page=${page}`)
            .then(response => {
                console.log(response.data);
            this.restaurants = response.data.restaurants.data;
            this.currentPage = response.data.restaurants.current_page;
            this.totalPages = response.data.restaurants.last_page;
            });
        },
        goToPage(page) {
            this.getAllRestaurants(page);
        },
    },
    computed: {
        pages() {
        const pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            pages.push(i);
        }
        return pages;
        },
    },
    
}
</script>

<template>
    <div class="jumbo">
        
        <div class="container-fluid">
            <h1 class="text-center pt-5">IL CIBO A CASA TUA</h1>  
            <h2 class="text-center  fs-1 ">Basta un click</h2>
        </div>        
    </div>
    

    <div class="d-flex gradient justify-content-center align-items-center">
        <h3 class=" text-center">Seleziona una o più categorie e un ristorante da cui ordinare</h3>
    </div>
    

    

    <div class="categories ">
        <div class="text-center text-white py-3"><i class="bi bi-arrow-down fs-1"></i></div>
        <h2 class="text-center pt-4">LE CATEGORIE</h2>
        <div class="container category-section pt-3">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">
                <div v-for="category in categories" class="col d-flex justify-content-center mb-3">
                    <label class="card-container  w-100 text-center text-uppercase" >
                        <input class="form-check-input d-none" v-model="selectedCategories" type="checkbox" 
                        :value="category.id" :id="'category-' + category.id" @change="filterRestaurants">
                        <div class="card py-3 " :style="{ backgroundImage: 'url(' + category.image + ')' }">
                            <div class="card-body d-flex justify-content-center align-items-center ">                     
                                <h5 class="card-title m-0">{{ category.name }}</h5>
                            </div>
                        </div>
                    </label>
                </div>     
            </div>     
        </div>
    </div>
    

    <div class="restaurants">
        <div class="container py-5 text-center  ">
            <h2 class="mb-5">I RISTORANTI</h2>
            <div v-if="noResults" class="alert alert-warning mt-3 d-flex justify-content-center align-items-center" role="alert">
                Non ci sono ristoranti che corrispondono alle categorie selezionate.
            </div>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-5 ">
                <div class="col d-flex justify-content-center" v-for="restaurant in restaurants" :key="restaurant.id">
                    <div class="card border-0 h-100" style="width: 18rem;">
                        <div class="ratio ratio-4x3">
                            <img :src="restaurant.image" class="card-img-top" alt="...">
                        </div>
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                                <h4 class="card-title">{{ restaurant.restaurant_name }}</h4>
                                <p class="card-text text-dark">{{ restaurant.address }}</p>
                                <div class=" w-75 d-flex justify-content-center align-items-center ">
                                    <span class="badge text-dark m-2 ">{{ restaurant.category_name }}</span>
                                    <div v-for="category in restaurant.categories">
                                        <span class="badge text-dark m-2 ">{{ category.name }}</span>
                                    </div>
                                    
                                </div>
                                <router-link :to="{name: 'restaurant', params: {slug: restaurant.slug} }" class="btn ">
                                        Menu
                                </router-link>
                        </div>
                    </div>
                </div>
            </div>     
        </div>

        <nav class="d-flex justify-content-center align-items-center" aria-label="Page navigation">
            <ul class="pagination">
                <li class="page-item" :class="{disabled: currentPage == 1}">
                    <a class="page-link text-dark" href="#" @click.prevent="goToPage(currentPage - 1)" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item"
                    v-for="page in pages"
                    :key="page"
                    :class="{active: currentPage === page}"
                    >
                    <a class="page-link text-dark" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                </li>
                <li class="page-item"
                    :class="{disabled: currentPage === totalPages}"
                    >
                    <a class="page-link text-dark" href="#" @click.prevent="goToPage(currentPage + 1)" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    

    <div class="about py-4">
        <div class="container text-white">
            <h2 class="text-center pb-4">LAVORA CON DELIVEBOO</h2>
            <div class="row row-cols-1 row-cols-md-3 row-cols-lg-3 text-center g-3 d-flex justify-content-center ">
                <div class="col">
                    <div class="card text-white">
                        <img src="../assets/riders.90e61988.jpg" class="card-img" alt="...">
                        <div class="card-img-overlay d-flex flex-column justify-content-between p-4">
                            <h5 class="card-title pb-3">Rider</h5>
                            <p class="card-text">Diventa un rider: flessibilità, ottimi guadagni e un mondo di vantaggi per te.</p>
                            <a href="#" class="btn btn-primary">Unisciti a noi</a>
                        </div>
                    </div>
                </div>
                <div class="col ristoranti">
                    <div class="card  text-white">
                        <img src="../assets/restaurants.3db91a35.jpg" class="card-img" alt="...">
                        <div class="card-img-overlay d-flex flex-column justify-content-between p-4">
                            <h5 class="card-title pb-3">Ristoranti</h5>
                            <p class="card-text">
                                Diventa partner di Deliveroo e raggiungi
                                sempre più clienti. Ci occupiamo noi
                                della consegna, così che la tua unica
                                preoccupazione sia continuare a
                                preparare il miglior cibo.
                            </p>
                            <a href="#" class="btn btn-primary">Diventa nostro partner</a>
                        </div>
                    </div>
                </div>
                <div class="col work">
                    <div class="card  text-white ">
                        <img src="../assets/team.d18fbb67.jpg" class="card-img" alt="...">
                        <div class="card-img-overlay d-flex flex-column justify-content-between p-4">
                            <h5 class="card-title pb-3">Lavora con noi</h5>
                            <p class="card-text">
                            La nostra missione è trasformare il modo
                            in cui le persone mangiano. È un
                            obiettivo ambizioso, come noi, e ci
                            servono persone che ci aiutino a
                            raggiungerlo.
                            </p>
                            <a href="#" class="btn btn-primary">Scopri di più</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
    

</template>

<style lang="scss">
.card {
    color: $secondary-color;
    font-weight: bold;
    background-color: #323233;
}

.card-container {
  cursor: pointer;
}

.card-container input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.card-container .card {
  border: 1px solid white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
}

.card-container input[type="checkbox"]:checked + .card {
//   box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
//   filter: grayscale(100%);

border: 3px solid $secondary-color;
 

}



.jumbo {
    height: 75vh;
    
    // background: rgb(135,116,170);
    // background: radial-gradient(circle, rgba(135,116,170,1) 0%, rgba(27,19,33,1) 100%);
    background-image:
     url('../assets/image-from-rawpixel-id-3807960-original.png'),
     linear-gradient(180deg, rgba(27,22,30,1) 0%, rgba(111,125,140,1) 100%),
      ;
    background-position: bottom;
    background-size: contain;
    background-repeat: no-repeat;
    
    h1 {
        color: white;
        font-size: 4rem;
    }

    h2 {
        color: $secondary-color;
    }

     

}



.categories {
    background-color: $primary-color-dark;

    .card {
        
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        
        .card-title {
            color: white;
            // text-shadow: 0 0 10px #FFFFFF;
            background-color: rgb(27, 22, 30, 0.7);
           
            
            
            
        }
    }

    h2 {
        color: white;
    }
}

.restaurants {
    background: rgb(27,22,30);
    background: linear-gradient(0deg, rgba(27,22,30,1) 0%, rgba(111,125,140,1) 38%);

    h2 {
        color: white;
    }

    .card {
        background-color: white;
        

        .btn {
            background-color: $primary-color;
            color: white;

            
        }

        .btn:hover {
                color: $secondary-color;
            }

        span {
                background-color: $secondary-color;
            }
    }

    .pagination .page-item.active .page-link {
    background-color: gray;
    border: black;
    }

    
}


.about {
    background-color: $primary-color;

    .col {
        min-width: 400px;
    }
    .card {

        
        h5 {
            font-size: 2em;
        }

        .btn {
            background-color: $secondary-color;
            border: none;
            color: black;
            font-weight: bold;

            &:hover {
                color: white;
            }
        }
    }


    .card-img-overlay {
        background-color: rgba(0, 0, 0, 0.5);
    }

    
}

// Gradients
.gradient {
  align-items: stretch;
  margin: 0 0;
  height: 4em;
  line-height: 2em;
  color: white;
  background: linear-gradient(90deg, hsl(211, 12%, 49%,), hsl(37, 68%,66%), hsl(211, 12%, 49%));
}





 
 

</style>