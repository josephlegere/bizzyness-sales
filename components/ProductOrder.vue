<template>
    <v-card
        class="pa-2 ma-2"
    >
        <v-list-item three-line class="px-2">
            <v-list-item-avatar
                tile
                size="80"
                color="grey"
                class="my-2"
            ></v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                    {{ order.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ order.calculatedPrice.unitPrice }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1 text-right">
                {{ (order.quantity * order.calculatedPrice.unitPrice).toFixed(2) }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-card-actions class="">
            <v-form ref="form" v-model="validate" class="d-flex justify-end" style="width: 100%;">
                <div class="d-flex flex-row align-center elevation-2 px-2 rounded">
                    <v-text-field
                        v-model="order.quantity"
                        type="number"
                        solo
                        flat
                        dense
                        single-line
                        hide-details="auto"
                        :disabled="order.stock <= 0"
                        :rules="[v => v > 0 || 'Must be 1 or greater!', v => v <= order.stock || 'Exceeded the sotck available!' ]"
                        style="width: 70px;"
                    ></v-text-field>
                    <div class="ml-1">
                        Qty.
                    </div>
                </div>
            </v-form>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        order: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            validate: false
        }
    },
    methods: {
        changeQuantity() {
            this.$refs.form.validate();

            if (this.validate) {
                // console.log(`Add ${this.quantity} ${this.order.name} To Cart`);
            }
        },
        removeOrder() {

        }
    }
}
</script>

<style>

</style>