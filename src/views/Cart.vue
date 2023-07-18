<script>
import axios from 'axios';
import braintree from 'braintree-web';
import CartAddRemove from '../components/CartAddRemove.vue';
export default {
      components: { CartAddRemove },
      data() {
            return {
                  hostedFieldInstance: false,
                  nonce: "",
                  error: "",
                  order: {
                        customer_name: '',
                        customer_surname: '',
                        customer_address: '',
                        customer_email: '',
                        phone_number: ''
                  }
            }
      },
      methods: {
            removeItem(item) {
                  this.$store.commit('addRemoveCart', { product: item, toAdd: false })
            },

            // modale sweetAlert
            sweetModal(state, title, text) {
                  return this.$swal({
                        title: title,
                        html: text,
                        icon: state,
                        confirmButtonText: 'Chiudi'
                  });
            },

            // chiamata post ordine
            postOrder() {
                  const total_price = this.$store.state.cartTotal.toFixed(2);
                  const cart = this.$store.state.cart;

                  axios
                        .post('http://127.0.0.1:8000/api/orders', {
                              customer_name: this.order.customer_name,
                              customer_surname: this.order.customer_surname,
                              customer_address: this.order.customer_address,
                              customer_email: this.order.customer_email,
                              phone_number: this.order.phone_number,
                              total_price: total_price,
                              cart: cart
                        })
                        .then(response => {
                              console.log(response.data);
                        });
            },

            // metodo che intercetta avvenuto/fallimento pagamento
            payWithCreditCard() {
                  // verifica che siano presenti tutti i campi di fatturazione e se mancanti da errore
                  if (this.order.customer_name == "" || this.order.customer_surname == "" || this.order.customer_address == "" || this.order.customer_email == "" || this.order.phone_number == "") {
                        this.sweetModal('error', 'Pagamento fallito', "Dati di fatturazione mancanti");
                  } else {   // se tutti campi sono presenti procede ai campi della carta

                        if (this.hostedFieldInstance) {
                              this.error = "";
                              this.nonce = "";

                              // mostra il loader
                              Swal.showLoading();

                              this.hostedFieldInstance.tokenize().then(payload => {
                                    console.log(payload);
                                    this.nonce = payload.nonce;

                                    // finto caricamento 
                                    setTimeout(() => {
                                          Swal.hideLoading();
                                          // se il pagamento va a buon fine da avviso di successo
                                          this.sweetModal('success', 'Pagamento effettuato', "L'ordine è stato completato.<br> Verrai reindirizzato alla homepage a brevissimo.");
                                          // ed invia l'ordine al backend
                                          this.postOrder();

                                          // mostra il loader
                                          Swal.showLoading();

                                          // dopo 5 secondi dall'avvenuto pagamento svuota localStorage, e quindi carrello, e reindirizza alla homepage
                                          setInterval(function () {
                                                localStorage.clear();
                                                window.location.replace("/");
                                          }, 4000);

                                    }, 1800)                                     
                              })
                                    .catch(err => {
                                          console.error(err);
                                          this.error = err.message;

                                          // nascondi il loader e mostra il modale di errore
                                          Swal.hideLoading();

                                          // se c'è un errore nel pagamento da avviso di controllare dati carta
                                          this.sweetModal('error', 'Pagamento fallito', "Controlla i dati della carta");
                                    })
                        }
                  }
            },
            checkoutControll() {
                  if (!this.$store.state.cartTotal) {
                        return this.sweetModal('error', 'Carrello vuoto', "Inserisci dei prodotti per procedere con l'acquisto");
                  }
            }
      },
      mounted() {
            braintree.client.create({
                  authorization: "sandbox_d5c8mrpr_x8v6tng7j377vj93"
            })
                  .then(clientInstance => {
                        let options = {
                              client: clientInstance,
                              styles: {
                                    input: {
                                          'font-size': '14px',
                                          'font-family': 'Open Sans'
                                    }
                              },
                              fields: {
                                    number: {
                                          container: '#creditCardNumber',
                                          placeholder: 'xxxx xxxx xxxx xxxx'
                                    },
                                    cvv: {
                                          container: '#cvv',
                                          placeholder: '***'
                                    },
                                    expirationDate: {
                                          container: '#expireDate',
                                          placeholder: '00 / 0000'
                                    }
                              }
                        }
                        return braintree.hostedFields.create(options)
                  })
                  .then(hostedFieldInstance => {
                        this.hostedFieldInstance = hostedFieldInstance;
                  })
                  .catch(err => {
                        console.error(err);
                        this.error = err.message;
                  });
      },
      computed: {
            fixedTotal() {
                  return this.$store.state.cartTotal.toFixed(2);
            }
      }
}
</script>

<template>
      <section class="cart pt-5">
            <div class="container py-3 ">
                  <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col">
                              <div class="cart-back rounded border-0">
                                    <div class=" p-3">

                                          <div class="row">
                                                <div class="col-lg-7">
                                                      <h5 class="mb-3 ">
                                                            <!-- <router-link :to="{ name: 'Home' }" class="text-white">
                                                                  Continua lo shopping</router-link> -->
                                                            <form>
                                                                  <input type="button" class="btn back-btn "
                                                                        value="Continua ad acquistare"
                                                                        onclick="history.back()">
                                                            </form>
                                                      </h5>
                                                      <hr>

                                                      <div class="d-flex justify-content-between align-items-center mb-4">
                                                            <div>
                                                                  <p class="mb-0">Hai {{ $store.state.cart.length }} piatti
                                                                        nel tuo carrello</p>
                                                            </div>
                                                      </div>

                                                      <div v-for="item in $store.state.cart"
                                                            class="card dishes-card mb-3 shadow-sm border-0" :key="item.id">
                                                            <div class="card-body p-1">
                                                                  <div class="d-flex justify-content-between">
                                                                        <div class="d-flex flex-row align-items-center">
                                                                              <div>
                                                                                    <img :src="item.image"
                                                                                          class="img-fluid rounded-3"
                                                                                          alt="Shopping item"
                                                                                          style="width: 85px;">
                                                                              </div>
                                                                              <div class="ms-2 ">
                                                                                    <p class="mb-0">{{ item.name }}</p>
                                                                              </div>
                                                                        </div>
                                                                        <div class="d-flex flex-row align-items-center">
                                                                              <div>
                                                                                    <CartAddRemove :product="item" />
                                                                              </div>
                                                                        </div>
                                                                        <div class="d-flex flex-row align-items-center justify-content-between w-25">
                                                                              <div class="">
                                                                                    <h5 class="mb-0 fs-6 ps-2 "><i
                                                                                                class="bi bi-currency-euro"></i>{{
                                                                                                      item.price * item.qty }}</h5>
                                                                                    <small v-if="item.hasDiscount"
                                                                                          class="text-muted text-decoration-line-through"><i
                                                                                                class="bi bi-currency-euro"></i>{{
                                                                                                      item.price }}</small>
                                                                              </div>
                                                                              <a role="button" @click="removeItem(item)"
                                                                                    class=" me-3" style="color: #cecece;"><i
                                                                                          class="bi bi-trash3 h4"></i></a>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                </div>
                                                <div class="col-lg-5">

                                                      <div class="cart-total text-white rounded border-0">
                                                            <div class="p-4">
                                                                  <div
                                                                        class="d-flex justify-content-between align-items-center mb-4">
                                                                        <h5 class="mb-0">Dettagli Carrello</h5>
                                                                        <i class="bi bi-cart3 h1"></i>
                                                                  </div>
                                                                  <hr class="my-4">
                                                                  <!-- <div class="d-flex justify-content-between">
                                                                        <p class="mb-2">Subtotal</p>
                                                                        <p class="mb-2"><i class="bi bi-currency-euro"></i>{{
                                                                              fixedTotal }}</p>
                                                                  </div> -->
                                                                  <div class="d-flex justify-content-between mb-4">
                                                                        <p class="mb-2">Totale</p>
                                                                        <p class="mb-2"><i class="bi bi-currency-euro"></i>{{
                                                                              fixedTotal }}</p>
                                                                  </div>

                                                                  <button type="button"
                                                                        class="btn  btn-block btn-lg"
                                                                        data-bs-toggle="modal"
                                                                        :data-bs-target="$store.state.cartTotal ? '#exampleModal' : ''"
                                                                        @click="checkoutControll()">
                                                                        Checkout
                                                                  </button>

                                                            </div>

                                                            <!-- Modal -->
                                                            <div class="modal fade" id="exampleModal" tabindex="-1"
                                                                  aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                  <div class="modal-dialog">

                                                                        <!-- / braintree test -->
                                                                        <div class="modal-content">
                                                                              <!--Header-->
                                                                              <div class="modal-header">
                                                                                    <h5 class="modal-title text-success"
                                                                                          id="exampleModalLabel">Pagamento
                                                                                    </h5>
                                                                                    <!-- <button type="button" class="btn-close"
                                                                                          data-bs-dismiss="modal"
                                                                                          aria-label="Close"></button> -->
                                                                              </div>
                                                                              <!--Body-->
                                                                              <div class="modal-body">
                                                                                    <form>
                                                                                          <div class="mb-2">
                                                                                                <input type="text"
                                                                                                      class="form-control"
                                                                                                      id="name"
                                                                                                      placeholder="Inserire nome"
                                                                                                      required
                                                                                                      v-model="order.customer_name">
                                                                                          </div>
                                                                                          <div class="mb-2">
                                                                                                <input type="text"
                                                                                                      class="form-control"
                                                                                                      id="surname"
                                                                                                      placeholder="Inserire cognome"
                                                                                                      required
                                                                                                      v-model="order.customer_surname">
                                                                                          </div>
                                                                                          <div class="mb-2">
                                                                                                <input type="text"
                                                                                                      class="form-control"
                                                                                                      id="address"
                                                                                                      placeholder="Inserire indirizzo"
                                                                                                      required
                                                                                                      v-model="order.customer_address">
                                                                                          </div>
                                                                                          <div class="mb-2">
                                                                                                <input type="email"
                                                                                                      class="form-control"
                                                                                                      id="email"
                                                                                                      placeholder="Inserire email"
                                                                                                      required
                                                                                                      v-model="order.customer_email">
                                                                                          </div>
                                                                                          <div class="mb-2">
                                                                                                <input type="phone"
                                                                                                      class="form-control"
                                                                                                      id="phone"
                                                                                                      placeholder="Inserire recapito telefonico"
                                                                                                      required
                                                                                                      v-model="order.phone_number">
                                                                                          </div>
                                                                                          <div class="mb-2 input-group">
                                                                                                <span class="input-group-text"
                                                                                                      id="basic-addon1">€</span>
                                                                                                <input type="text"
                                                                                                      class="form-control"
                                                                                                      id="amount"
                                                                                                      v-model="fixedTotal"
                                                                                                      disabled>
                                                                                          </div>
                                                                                          <div class="form-group text-black">
                                                                                                <label>Numero carta di
                                                                                                      credito</label>
                                                                                                <div id="creditCardNumber"
                                                                                                      class="form-control">
                                                                                                </div>
                                                                                          </div>
                                                                                          <div class="form-group text-black">
                                                                                                <div class="row">
                                                                                                      <div class="col-6">
                                                                                                            <label>Data
                                                                                                                  scadenza</label>
                                                                                                            <div id="expireDate"
                                                                                                                  class="form-control">
                                                                                                            </div>
                                                                                                      </div>
                                                                                                      <div class="col-6">
                                                                                                            <label>CVV</label>
                                                                                                            <div id="cvv"
                                                                                                                  class="form-control">
                                                                                                            </div>
                                                                                                      </div>
                                                                                                </div>
                                                                                          </div>
                                                                                    </form>
                                                                              </div>
                                                                              <!--Footer-->
                                                                              <div class="modal-footer">
                                                                                    <button type="submit"
                                                                                          class="btn btn-primary btn-block"
                                                                                          @click.prevent="payWithCreditCard">Paga con la carta
                                                                                    </button>
                                                                                    <button type="button"
                                                                                          class="btn btn-warning"
                                                                                          data-bs-dismiss="modal">Chiudi</button>
                                                                              </div>
                                                                        </div>
                                                                        <!-- ----------------------------------------------- -->

                                                                  </div>
                                                            </div>
                                                      </div>

                                                </div>

                                          </div>

                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      </section>
</template>

<style lang="scss">
.cart {
      height: 90vh;
      background: rgb(27, 22, 30);
      background: linear-gradient(0deg, rgba(27, 22, 30, 1) 2%, rgba(111, 125, 140, 1) 50%, rgba(27, 22, 30, 1) 100%);


}

.cart-back {
      background-color: lightgrey;

      .back-btn {
            background-color: #33343e;
            border: none;
            color: white;
            &:hover {
                  transform: scale(1.1);
            }
      }
}

.modal-content {
      .btn {
      color: white;
      
}

.btn:hover {
            
            color: $secondary-color;
            
      }
}



.cart-total {
      background-color: $secondary-color;

      .btn {
            background-color: $primary-color;
            border: none;
            color: white;

            &:hover {
                  transform: scale(1.1);
            }
            
            
      }

      
}

.cart-total {
      background-color: $secondary-color;
}




.dishes-card {
      background-color: white;
}

#expireDate,
#cvv,
#creditCardNumber,
#customer_name {
      height: 38px;
}
</style>