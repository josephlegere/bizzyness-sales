<template>
    <v-card
        class="pa-2 ma-2"
    >
        <v-list-item three-line class="px-2">
            <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                    {{ record.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    <div v-if="record.stock > 0" class="green--text darken-3"><b>In Stock</b></div>
                    <div v-else class="red--text darken-4"><b>Out of Stock</b></div>
                </v-list-item-subtitle>
                <div>
                    <div v-if="record.keywords && record.keywords.includes('$Flexible_Pricing')">
                        <v-text-field
                            v-model="pricing"
                            type="number"
                            solo
                            flat
                            dense
                            single-line
                            hide-details="auto"
                            :disabled="record.stock <= 0"
                            :rules="[v => v > 0 || 'Must be 1 or greater!']"
                            style="width: 70px;"
                        ></v-text-field>
                    </div>
                    <v-list-item-subtitle v-else class="text-h6">{{ pricing }}</v-list-item-subtitle>
                </div>
            </v-list-item-content>

            <v-list-item-avatar
                tile
                size="80"
                color="grey"
                class="my-2"
            ></v-list-item-avatar>
        </v-list-item>
        <v-card-actions class="">
            <v-form ref="form" v-model="validate" class="d-flex justify-end" style="width: 100%;">
                <div class="d-flex flex-row align-center elevation-2 px-2 rounded">
                    <v-text-field
                        v-model="quantity"
                        type="number"
                        solo
                        flat
                        dense
                        single-line
                        hide-details="auto"
                        :disabled="record.stock <= 0"
                        :rules="[v => v > 0 || 'Must be 1 or greater!', v => v <= record.stock || 'Exceeded the stock available!' ]"
                        style="width: 70px;"
                    ></v-text-field>
                    <div class="ml-1">
                        Qty.
                    </div>
                </div>
                <v-spacer></v-spacer>
                <v-btn
                    color="#663b0e"
                    :dark="record.stock > 0"
                    @click="addToCart"
                    :disabled="record.stock <= 0"
                >
                    Add
                    <v-icon right>mdi-cart</v-icon>
                </v-btn>
            </v-form>
        </v-card-actions>
    </v-card>
</template>

<script>
import _ from 'lodash';

export default {
    props: {
        record: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            quantity: 1,
            validate: false,
            pricing: this.record.calculatedPrice.unitPrice
        }
    },
    methods: {
        addToCart() {
            this.$refs.form.validate();

            if (this.validate) {
                console.log(`Add ${this.quantity} ${this.record.name} To Cart`);
                let { id, _uniqueIdentifier, productNumber, name, calculatedPrice, media, stock, keywords } = _.cloneDeep(this.record);
                calculatedPrice.unitPrice = this.pricing;
                this.$emit('add-order', { id, _uniqueIdentifier, productNumber, name, calculatedPrice, media, stock, keywords, quantity: this.quantity });
            }
        }
    }
}
</script>

<style>

</style>