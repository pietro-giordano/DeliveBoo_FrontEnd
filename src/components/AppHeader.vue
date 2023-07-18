<template>
    <nav class="navbar  navbar-expand-lg h-50 p-0">
  <div class="container-fluid ">
    <a class="navbar-brand" href="/">
      <img src="../assets/deliveboo bianco.svg" alt="Bootstrap" width="150" height="80">
    </a>
    
    <button class="navbar-toggler btn btn-outline-warning" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon "></span>
    </button>
    <div class="collapse navbar-collapse align-items-center   " id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto  mb-2 mb-lg-0 text-end">
        <li class="nav-item  rounded">
          <button class="btn btn-bg px-2 py-0"> 
            <a class="nav-link item-bg active text-white" aria-current="page" href="http://127.0.0.1:8000/login">Login</a>
          </button>
          
        </li>
        <li class="nav-item  rounded">
          <button class="btn btn-bg px-2 py-0">
            <a class="nav-link active item-bg text-white" aria-current="page" href="http://127.0.0.1:8000/register">Registrati</a>
          </button>
          
        </li>
        <li class="nav-item px-2 py-0">
          <span class="nav-item text-decoration-none align-items-end ">
          <router-link class="nav-link text-white" :class="$route.name == 'Cart'? 'active':''" aria-current="page" :to="{ name: 'Cart' }">
            <i class="bi bi-cart3 h4"></i>
            <span v-if="$store.state.cart.length > 0" class="align-items-center justify-content-center translate-middle badge rounded-pill bg-warning">
              {{ $store.state.cart.length }}
            </span>
          </router-link>
      </span>
        </li>
        <!-- <li class="nav-item">
            <router-link :to="{name:'About'}" class="nav-link" aria-current="page" href="#">About</router-link>
        </li> -->
      </ul>

    </div>
  </div>
</nav>
</template>

<style lang="scss" >
.navbar {
  background-color: $primary-color;
 

  .navbar-toggler {
    
    border: 1px solid $secondary-color;
    background: transparent;
  }

  .navbar-toggler-icon {

    background-image: url(
"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(236, 184, 102, 0.8)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
     
  }
}

nav {
  height: 100px;
  width: 100%;

  .btn-bg:hover {
    background-color: $secondary-color;
  }
}
</style>