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
            <v-row
                no-gutters
                v-for="m in 4"
                :key="m"
                cols="12"
            >
                <v-col
                    v-for="n in 3"
                    :key="n"
                    cols="12"
                    sm="4"
                >
                    <v-card
                        class="pa-2 ma-2"
                    >
                        <v-card-title>Hello</v-card-title>
                    </v-card>
                </v-col>
            </v-row>
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
                        <v-toolbar-title class="mr-4">60</v-toolbar-title>

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
                                        <v-toolbar-title>{{ editingTransaction ? 'Edit' : 'Add'}} an Account</v-toolbar-title>
                                    </v-toolbar>

                                    <v-card-text class="my-md-16">
                                        <v-container>
                                            <v-form ref="form" v-model="validate">
                                                <v-row>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                    >
                                                        <v-text-field
                                                            label="Account Name *"
                                                            :rules="[v => !!v || 'Account Name is required']"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                        class="d-flex flex-row-reverse"
                                                    >
                                                        <v-btn
                                                            dark
                                                        >Submit</v-btn>
                                                            <!-- :loading="submittingForm"
                                                            :disabled="submittingForm" -->
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                    >
                                                        <small>* indicates required field</small>
                                                    </v-col>
                                                </v-row>
                                            </v-form>
                                        </v-container>
                                    </v-card-text>
                                </v-card>
                            </v-bottom-sheet>

                    </v-toolbar>
                </v-sheet>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            search: '',
            cartModal: false
        }
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