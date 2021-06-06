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
                                    <v-row>
                                        <v-col
                                            v-for="(order, i) in orders"
                                            cols="12"
                                            md="8"
                                            offset-md="2"
                                            :key="i"
                                        >
                                            <ProductOrder :order="order" />
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
                                            >Confirm</v-btn>
                                        </v-col>
                                    </v-form>
                                </v-card-actions>
                            </v-card>
                        </v-bottom-sheet>

                    </v-toolbar>
                </v-sheet>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import ProductGrid from '../components/ProductGrid';
import ProductOrder from '../components/ProductOrder';

export default {
    data () {
        return {
            search: '',
            products: [
                {
                    id: '1',
                    name: 'Water Bottle',
                    calculatedPrice: {
                        unitPrice: '10'
                    },
                    media: {
                        url: ''
                    },
                    stock: 10
                },
                {
                    id: '2',
                    name: 'Crushed Ice',
                    calculatedPrice: {
                        unitPrice: '15'
                    },
                    media: {
                        url: ''
                    },
                    stock: 2
                },
                {
                    id: '3',
                    name: 'Tube Ice',
                    calculatedPrice: {
                        unitPrice: '20'
                    },
                    media: {
                        url: ''
                    },
                    stock: 5
                },
            ],
            orders: [],
            cartModal: false,
            validate: false,
            submittingForm: false
        }
    },
    methods: {
        addToCart(order) {
            let _existing = this.orders.findIndex(_order => _order.id === order.id);
            if (_existing >= 0) this.orders.splice(_existing, 1, order);
            else this.orders.push(order);
        },
        submitCart() {
            this.$refs.form.validate();

            if (this.validate) {
                console.log(this.orders);
                this.submittingForm = true;
            }
        }
    },
    computed: {
        total() {
            return this.orders.reduce((acc, curr) => acc + (curr.calculatedPrice.unitPrice * curr.quantity), 0);
        }
    },
    components: {
        ProductGrid,
        ProductOrder
    }
}
</script>

<style>
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
</style>