<template>
    <div>
        <v-row no-gutters="">
            <v-col>
                <v-card class="mb-6">
                    <v-card-title>
                        <v-row no-gutters>
                            <v-col cols="12" md="6" offset-md="3">
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <div v-if="loading">
            <v-container class="mb-16">
                <v-row no-gutters>
                    <v-col
                        v-for="i in 3"
                        :key="i"
                        cols="12"
                        md="4"
                    >
                        <v-skeleton-loader
                            type="article, actions"
                        ></v-skeleton-loader>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <div v-else>
            <v-container class="mb-16">
                <ProductGrid :records="products" @add-to-cart="addToCart" /> <!-- Columns default 3 -->
            </v-container>
            
            <v-row
                class="toolbar-container"
                no-gutters
            >
                <v-col
                    md="3"
                    class="ml-md-auto"
                >
                    <v-sheet
                        color="transparent"
                        class="form-toolbar">
                        <v-toolbar
                            dark
                            height="60">

                            <v-toolbar-title class="mr-4">Total:</v-toolbar-title>
                            <v-toolbar-title class="mr-4">{{ total }}</v-toolbar-title>

                            <v-spacer></v-spacer>

                            <v-btn
                                outlined
                                :small="$vuetify.breakpoint.smAndDown"
                                @click="cartModal = true"
                                class="ml-md-1"
                            >
                                Cart
                                <v-icon
                                    right
                                    dark
                                >
                                    mdi-cart-outline
                                </v-icon>
                            </v-btn>

                            <v-bottom-sheet v-model="cartModal" scrollable transition="dialog-bottom-transition">
                                <v-card class="rounded-t-xl">
                                    <v-toolbar dark dense class="rounded-t-xl">
                                        <v-btn icon dark @click="cartModal = !cartModal">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                        <v-toolbar-title>Cart Details</v-toolbar-title>
                                    </v-toolbar>

                                    <v-card-text class="my-2 my-md-8">
                                        <v-row class="mt-1">
                                            <v-col
                                                v-for="(order, i) in orders"
                                                cols="12"
                                                md="8"
                                                offset-md="2"
                                                :key="i"
                                            >
                                                <ProductOrder :order="order" :ref="`porder`" @remove-order="removeFromCart" />
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-actions class="elevation-2">
                                        <v-form ref="form" v-model="validate" style="width: 100%;">
                                            <v-col
                                                cols="12"
                                                md="8"
                                                offset-md="2"
                                                class="d-flex justify-space-between align-center"
                                            >
                                                <div class="text-h5" v-text="`Total: `"></div>
                                                <v-text-field
                                                    v-model="total"
                                                    :rules="[v => parseInt(v) > 0 || 'Total is required']"
                                                    readonly
                                                    solo
                                                    flat
                                                    dense
                                                    hide-details="auto"
                                                    background-color="rgba(255,255,255, 0)"
                                                    style="width:120px; margin: auto 0; font-size: 1.5rem;"
                                                ></v-text-field>
                                                <v-btn
                                                    :dark="!submittingForm"
                                                    :loading="submittingForm"
                                                    :disabled="submittingForm"
                                                    @click="submitCart"
                                                >Checkout</v-btn>
                                            </v-col>
                                        </v-form>
                                    </v-card-actions>
                                </v-card>
                            </v-bottom-sheet>

                        </v-toolbar>
                    </v-sheet>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-alert
                        v-model="alertSuccess"
                        border="bottom"
                        elevation="2"
                        close-text="Close Alert"
                        color="rgba(102, 59, 14, 0.95)"
                        dark
                        dismissible
                        transition="scroll-y-transition"
                        class="mt-2 alert-box"
                        type="success"
                    >
                        {{ prompts }}
                    </v-alert>

                    <v-alert
                        v-model="alertError"
                        border="bottom"
                        elevation="2"
                        close-text="Close Alert"
                        color="rgba(102, 59, 14, 0.95)"
                        dark
                        dismissible
                        transition="scroll-y-transition"
                        class="mt-2 alert-box"
                        type="error"
                    >
                        {{ prompts }}
                    </v-alert>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import ProductGrid from '../components/ProductGrid';
import ProductOrder from '../components/ProductOrder';

export default {
    data () {
        return {
            loading: false,
            search: '',
            orders: [],
            cartModal: false,
            validate: false,
            submittingForm: false,
            alertSuccess: false,
            alertError: false,
            prompts: 'Prompt!'
        }
    },
    methods: {
        addToCart(order) {
            let _existing = this.orders.findIndex(_order => _order.id === order.id);
            if (_existing >= 0) this.orders.splice(_existing, 1, order);
            else this.orders.push(order);
        },
        removeFromCart(order) {
            console.log(this.orders);
            console.log(order);
            this.orders = _.difference(this.orders, [order])
        },
        async submitCart() {
            console.log(this.$refs.form);
            console.log(this.$refs.porder);

            this.$refs.form.validate();
            if (!this.validate) throw 'Form Not Validated!';

            Object.values(this.$refs.porder).forEach((elem ,key) => {
                console.log(elem);
                elem.$refs.form.validate();
                if (!elem.validate) throw `Child Component ${key} Not Validated!`;
            });

            console.log(this.orders);
            this.submittingForm = true;
            
            await this.$store.dispatch('invoices/next', this.tenant);
            
            this.$store.dispatch('products/add', { user: this.loggeduser, orders: this.orders, total: this.total, invoice_code: this.invoice_number, account: this.getCashOnHand, category: this.getSales })
            .then(res => {
                this.cartModal = false;
                this.prompts = 'Successfully Added a Sales!'
                this.alertSuccess = true;
                setTimeout(() => {
                    this.alertSuccess = false;
                }, 5000);
            })
            .catch(err => {
                this.prompts = err;
                this.alertError = true;
                setTimeout(() => {
                    this.alertError = false;
                }, 10000);
            })
            .finally(() => {
                this.validate = false;
                this.submittingForm = false;
            });
        },
        object_filter (obj, predicate) {
            return Object.entries(obj)
                .filter( value => predicate(value[1]) )
        }
    },
    computed: {
        ...mapState({
            products: state => state.products.list,
            loggeduser: state => state.auth.loggeduser,
            invoice_number: state => state.invoices.current,
            accounts: state => state.accounts.list
        }),
        tenant() {
            return this.loggeduser.tenantid.split('/')[1];
        },
        total() {
            return this.orders.reduce((acc, curr) => acc + (curr.calculatedPrice.unitPrice * curr.quantity), 0);
        },
        getCashOnHand() {
            console.log(Object.keys(this.accounts).length);
            let _account = this.object_filter(this.accounts, value => value.name.toLowerCase().replace(/\s+/g, '') === 'cashonhand')[0];
            console.log(_account);
            let { currency, name } = _account[1];
            return { id: `tenant_accounts/${this.tenant}/accounts/${_account[0]}`, name, currency };
        },
        getSales() {
            let _account = this.object_filter(this.accounts, value => value.name.toLowerCase().replace(/\s+/g, '') === 'sales')[0];
            let { account_type } = _account[1];
            return { id: `invoices/${this.tenant}/payments/${_account[0]}`, name: 'Sales Invoice', account_type };
        }
    },
    watch: {
        cartModal (val) {
            !val && this.$refs.form.reset();
        }
    },
    async created() {
        this.loading = true;
        await this.$store.dispatch('products/get', this.tenant);
        await this.$store.dispatch('accounts/get', this.tenant);
        this.loading = false;
    },
    components: {
        ProductGrid,
        ProductOrder
    }
}
</script>

<style scoped>
    .toolbar-container {
        width:                  100%;
        position:               fixed;
        z-index:                4;
        bottom:                 35px;
        right:                  0;
    }
    .toolbar-container .col {
        width:                  100%;
    }
    .form-toolbar {
        width:                  100%;
    }
    .form-toolbar .v-toolbar {
        /* v-sheet default color is white, need to turn it transparent to remove for the border-radius apply its design */
        /* v-sheet need to contain the toolbar in order for the border radius to take effect */
        box-shadow:             0px -2px 4px -1px rgb(0 0 0 / 20%), 0px -2px 5px 0px rgb(0 0 0 / 14%);
        border-radius:          15px 15px 0 0;
    }
    .alert-box {
        position:               fixed;
        top:                    0;
        z-index:                5;
        width:                  100%;
    }
</style>