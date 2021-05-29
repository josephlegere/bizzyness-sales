<template>
    <v-timeline-item
        small
        color="grey"
    >
        <div>
            <div class="font-weight-normal">
                <strong>{{ payment.date.toDate() | moment("MMMM Do, YYYY") }} - A payment for {{ payment.account.currency.code }} {{ payment.amount }} ‎was made using {{ payment.method }}.</strong>
            </div>
            <div v-if="key_item===0">Down Payment</div>
            <div>
                <PaymentRecord
                    editing
                    :editData="payment"
                    text
                    small
                    color="#663b0e"
                    buttonText="Edit"
                    @payment="editPayment" />
                <v-btn text small color="#663b0e" @click="confirmDelete = true">Delete</v-btn>
            </div>
        </div>
        <v-dialog
            v-model="confirmDelete"
            max-width="290"
        >
            <v-card rounded="xl">
                <v-card-title class="headline">Delete Payment</v-card-title>

                <v-card-text>
                    Are you sure you want to delete the payment of <b>{{ payment.account.currency.code }} {{ payment.amount }}</b>?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="#303030"
                        text
                        @click="confirmDelete = false"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                        color="#663b0e"
                        dark
                        @click="deletePayment"
                    >
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-timeline-item>
</template>

<script>
import PaymentRecord from '~/components/PaymentRecord';

export default {
    props: {
        payment: {
            type: Object,
            required: true
        },
        key_item: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            confirmDelete: false
        }
    },
    methods: {
        deletePayment() {
            this.$emit('delete', this.payment.id);
            this.confirmDelete = false;
        },
        editPayment(updates) {
            this.$emit('update', { payment: this.payment.id, updates });
        }
    },
    components: {
        PaymentRecord
    }
}
</script>

<style>

</style>