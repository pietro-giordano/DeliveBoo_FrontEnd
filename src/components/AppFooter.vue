<script>
    export default{
        name:'AppFooter',
        data(){
            return{
                sections:[
                    {
                        title: 'Uniamo le forze',
                        links:[
                            'Lavora con noi',
                            'Deliveboo per i Partner',
                            'Corrieri',
                            'Deliveboo Business',
                        ]
                    },
                    {
                        title: 'Link di interesse',
                        links:[
                            'Chi siamo',
                            'FAQ',
                            'Deliveboo Prime',
                            'Blog',
                            'Contattaci',
                            'Sicurezza',
                        ]
                    },
                    {
                        title: 'Seguici',
                        links:[
                            'Facebook',
                            'Twitter',
                            'Instagram',
                        ]
                    },
                    {
                        links:[
                            'Termini e condizioni',
                            'Politica sulla privacy',
                            'Politica sui cookie',
                            'Conformità'
                        ]
                    }
                ]
            }
        },
    }
</script>

<template>
        <footer class="text-muted py-5 h-100 ">
            <!-- <a class="navbar-brand" href="/">
                <img class="mb-3" src="../assets/logo-white.svg" alt="Bootstrap" width="150" height="30">
            </a> -->
            <div class="container">
                <div class="d-flex justify-content-between row row-cols-1 row-cols-md-2 row-cols-lg-4">
                    <div v-for="section in sections" :key="section.title">
                        <ul class="my-4 mb-lg-0">
                            <li><h3 class="mb-3">{{ section.title }}</h3></li>
                            <li class="mb-2" v-for="link in section.links" :key="link">{{ link }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
</template>

<style lang="scss" scoped>
footer {
    background-color: $primary-color;
    width: 100%;
}
.container{
    margin: 0 auto;
    text-align: center;
}
ul{
    list-style-type: none;
    li:hover:not(:first-child){
        color:  #ecb866;
        cursor:pointer;
    }
    li:first-child{
        color: aliceblue;
    }
}
</style>
